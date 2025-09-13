<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        // Validate the request
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore(Auth::id()),
            ],
            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'background_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:4096'],
            'birthdate' => ['nullable', 'date', 'before:today'],
        ]);

        /** @var User $user */
        $user = Auth::user();

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            // Delete old profile picture if it exists
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $profilePicturePath = $request->file('profile_picture')->store('profile-pictures', 'public');
            $user->profile_picture = $profilePicturePath;
        }

        // Handle background picture upload
        if ($request->hasFile('background_picture')) {
            // Delete old background picture if it exists
            if ($user->background_picture) {
                Storage::disk('public')->delete($user->background_picture);
            }

            $backgroundPicturePath = $request->file('background_picture')->store('background-pictures', 'public');
            $user->background_picture = $backgroundPicturePath;
        }

        // Update other fields
        $user->fill(collect($validated)->except(['profile_picture', 'background_picture'])->toArray());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Remove a user's profile or background picture.
     */
    public function removePicture(Request $request, string $type): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        if ($type === 'profile' && $user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->profile_picture = null;
            $user->save();
        } elseif ($type === 'background' && $user->background_picture) {
            Storage::disk('public')->delete($user->background_picture);
            $user->background_picture = null;
            $user->save();
        }

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
