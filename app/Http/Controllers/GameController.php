<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GameController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Game::with('user')
            ->published()
            ->latest();

        // Filter by category
        if ($request->category) {
            $query->byCategory($request->category);
        }

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by featured
        if ($request->featured) {
            $query->featured();
        }

        $games = $query->paginate(12);

        $categories = [
            'action', 'adventure', 'puzzle', 'strategy', 'rpg',
            'simulation', 'sports', 'racing', 'platformer', 'other'
        ];

        return Inertia::render('games/index', [
            'games' => $games,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'featured']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('games/upload');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category' => 'required|string|in:action,adventure,puzzle,strategy,rpg,simulation,sports,racing,platformer,other',
            'tags' => 'nullable|string',
            'version' => 'nullable|string|max:20',
            'min_players' => 'nullable|integer|min:1|max:100',
            'max_players' => 'nullable|integer|min:1|max:100|gte:min_players',
            'game_file' => 'required|file|mimes:zip,rar,7z|max:102400', // 100MB max
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
        ]);

        // Handle file uploads
        $gameFilePath = $request->file('game_file')->store('games', 'public');
        $thumbnailPath = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        // Process tags: convert comma-separated string to array
        $tagsArray = [];
        if (!empty($validated['tags'])) {
            $tagsArray = array_map('trim', explode(',', $validated['tags']));
            $tagsArray = array_filter($tagsArray); // Remove empty values
            $tagsArray = array_slice($tagsArray, 0, 10); // Limit to 10 tags
        }

        $game = Game::create([
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'tags' => $tagsArray,
            'version' => $validated['version'] ?? '1.0',
            'min_players' => $validated['min_players'],
            'max_players' => $validated['max_players'],
            'file_path' => $gameFilePath,
            'thumbnail_path' => $thumbnailPath,
            'status' => 'published'
        ]);

        return redirect()->route('games.show', $game)
            ->with('success', 'Game uploaded successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Game $game)
    {
        $game->load(['user', 'updates' => function ($query) {
            $query->published()->latest()->take(5);
        }, 'discussions' => function ($query) {
            $query->latest()->take(5);
        }]);

        // Increment views count
        $game->increment('views_count');

        $relatedGames = Game::where('category', $game->category)
            ->where('id', '!=', $game->id)
            ->published()
            ->take(4)
            ->get();

        return Inertia::render('games/show', [
            'game' => $game,
            'relatedGames' => $relatedGames,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Game $game)
    {
        $this->authorize('update', $game);

        return Inertia::render('games/edit', [
            'game' => $game,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Game $game)
    {
        $this->authorize('update', $game);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'category' => 'required|string|in:action,adventure,puzzle,strategy,rpg,simulation,sports,racing,platformer,other',
            'tags' => 'nullable|string',
            'version' => 'nullable|string|max:20',
            'min_players' => 'nullable|integer|min:1|max:100',
            'max_players' => 'nullable|integer|min:1|max:100|gte:min_players',
            'game_file' => 'nullable|file|mimes:zip,rar,7z|max:102400',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        // Process tags: convert comma-separated string to array
        $tagsArray = [];
        if (!empty($validated['tags'])) {
            $tagsArray = array_map('trim', explode(',', $validated['tags']));
            $tagsArray = array_filter($tagsArray); // Remove empty values
            $tagsArray = array_slice($tagsArray, 0, 10); // Limit to 10 tags
        }
        $validated['tags'] = $tagsArray;

        // Handle file uploads
        if ($request->hasFile('game_file')) {
            // Delete old file
            if ($game->file_path) {
                Storage::disk('public')->delete($game->file_path);
            }
            $validated['file_path'] = $request->file('game_file')->store('games', 'public');
        }

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($game->thumbnail_path) {
                Storage::disk('public')->delete($game->thumbnail_path);
            }
            $validated['thumbnail_path'] = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $game->update($validated);

        return redirect()->route('games.show', $game)
            ->with('success', 'Game updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Game $game)
    {
        $this->authorize('delete', $game);

        // Delete files
        if ($game->file_path) {
            Storage::disk('public')->delete($game->file_path);
        }
        if ($game->thumbnail_path) {
            Storage::disk('public')->delete($game->thumbnail_path);
        }

        $game->delete();

        return redirect()->route('games.index')
            ->with('success', 'Game deleted successfully!');
    }

    /**
     * Download the game file.
     */
    public function download(Game $game)
    {
        if (!$game->file_path || !Storage::disk('public')->exists($game->file_path)) {
            abort(404, 'Game file not found');
        }

        // Increment download count
        $game->increment('downloads_count');

        return response()->download(Storage::disk('public')->path($game->file_path), $game->title . '.zip');
    }
}
