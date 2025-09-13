<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Update;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UpdateController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Update::with(['user', 'game'])
            ->published()
            ->latest();

        // Filter by type
        if ($request->type) {
            $query->byType($request->type);
        }

        // Filter by importance
        if ($request->importance) {
            $query->byImportance($request->importance);
        }

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        $updates = $query->paginate(10);

        $types = ['update', 'patch', 'hotfix', 'announcement', 'news'];
        $importancelevels = ['low', 'medium', 'high', 'critical'];

        return Inertia::render('updates/index', [
            'updates' => $updates,
            'types' => $types,
            'importancelevels' => $importancelevels,
            'filters' => $request->only(['type', 'importance', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $userGames = Game::where('user_id', Auth::id())
            ->published()
            ->select('id', 'title')
            ->get();

        return Inertia::render('updates/create', [
            'games' => $userGames,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'nullable|exists:games,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'type' => 'required|string|in:update,patch,hotfix,announcement,news',
            'importance' => 'required|string|in:low,medium,high,critical',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Verify game ownership if game_id is provided
        if ($validated['game_id']) {
            $game = Game::findOrFail($validated['game_id']);
            if ($game->user_id !== Auth::id()) {
                abort(403, 'You can only create updates for your own games.');
            }
        }

        $update = Update::create([
            'user_id' => Auth::id(),
            'game_id' => $validated['game_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'type' => $validated['type'],
            'importance' => $validated['importance'],
            'is_pinned' => $validated['is_pinned'] ?? false,
            'published_at' => $validated['published_at'] ?? now(),
        ]);

        return redirect()->route('updates.index')
            ->with('success', 'Update created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Update $update)
    {
        $update->load(['user', 'game']);

        // Increment views count
        $update->increment('views_count');

        $relatedUpdates = Update::where('type', $update->type)
            ->where('id', '!=', $update->id)
            ->published()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('updates/show', [
            'update' => $update,
            'relatedUpdates' => $relatedUpdates,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Update $update)
    {
        $this->authorize('update', $update);

        $userGames = Game::where('user_id', Auth::id())
            ->published()
            ->select('id', 'title')
            ->get();

        return Inertia::render('updates/edit', [
            'update' => $update,
            'games' => $userGames,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Update $update)
    {
        $this->authorize('update', $update);

        $validated = $request->validate([
            'game_id' => 'nullable|exists:games,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'type' => 'required|string|in:update,patch,hotfix,announcement,news',
            'importance' => 'required|string|in:low,medium,high,critical',
            'is_pinned' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        // Verify game ownership if game_id is provided
        if ($validated['game_id']) {
            $game = Game::findOrFail($validated['game_id']);
            if ($game->user_id !== Auth::id()) {
                abort(403, 'You can only link updates to your own games.');
            }
        }

        $update->update($validated);

        return redirect()->route('updates.show', $update)
            ->with('success', 'Update updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Update $update)
    {
        $this->authorize('delete', $update);

        $update->delete();

        return redirect()->route('updates.index')
            ->with('success', 'Update deleted successfully!');
    }
}
