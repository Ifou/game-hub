<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use App\Models\Game;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DiscussionController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Discussion::with(['user', 'game'])
            ->where('user_id', Auth::id()) // Only show current user's discussions
            ->unlocked()
            ->active();

        // Filter by category
        if ($request->category) {
            $query->byCategory($request->category);
        }

        // Filter by game
        if ($request->game_id) {
            $query->where('game_id', $request->game_id);
        }

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by featured/pinned
        if ($request->featured) {
            $query->featured();
        }

        if ($request->pinned) {
            $query->pinned();
        }

        $discussions = $query->latest()->paginate(15);

        // Get recent updates (for the combined forum view)
        $updatesQuery = \App\Models\Update::with(['user', 'game'])
            ->published();

        // Apply same filters to updates
        if ($request->game_id) {
            $updatesQuery->where('game_id', $request->game_id);
        }

        if ($request->search) {
            $updatesQuery->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }

        $updates = $updatesQuery->latest()->take(10)->get();

        // Get all games for the filter dropdown
        $games = \App\Models\Game::published()
            ->select('id', 'title', 'user_id')
            ->with('user:id,name')
            ->get();

        $categories = [
            'general', 'help', 'feedback', 'showcase', 'development',
            'bug-reports', 'feature-requests', 'off-topic'
        ];

        return Inertia::render('forum/index', [
            'discussions' => $discussions,
            'updates' => $updates,
            'games' => $games,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'featured', 'pinned', 'game_id', 'type']),
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

        return Inertia::render('forum/create', [
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
            'category' => 'required|string|in:general,help,feedback,showcase,development,bug-reports,feature-requests,off-topic',
            'tags' => 'array|max:5',
            'tags.*' => 'string|max:30',
        ]);

        // Verify game ownership if game_id is provided
        if ($validated['game_id']) {
            $game = Game::findOrFail($validated['game_id']);
            if ($game->user_id !== Auth::id()) {
                abort(403, 'You can only create discussions for your own games.');
            }
        }

        $discussion = Discussion::create([
            'user_id' => Auth::id(),
            'game_id' => $validated['game_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'category' => $validated['category'],
            'tags' => $validated['tags'] ?? [],
            'last_activity_at' => now(),
        ]);

        return redirect()->route('forum.show', $discussion)
            ->with('success', 'Discussion created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Discussion $discussion)
    {
        $discussion->load([
            'user',
            'game',
            'replies' => function ($query) {
                $query->with(['user', 'replies.user'])
                    ->topLevel()
                    ->latest();
            }
        ]);

        // Increment views count
        $discussion->increment('views_count');

        $relatedDiscussions = Discussion::where('category', $discussion->category)
            ->where('id', '!=', $discussion->id)
            ->unlocked()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('forum/show', [
            'discussion' => $discussion,
            'relatedDiscussions' => $relatedDiscussions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Discussion $discussion)
    {
        $this->authorize('update', $discussion);

        $userGames = Game::where('user_id', Auth::id())
            ->published()
            ->select('id', 'title')
            ->get();

        return Inertia::render('forum/edit', [
            'discussion' => $discussion,
            'games' => $userGames,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Discussion $discussion)
    {
        $this->authorize('update', $discussion);

        $validated = $request->validate([
            'game_id' => 'nullable|exists:games,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'category' => 'required|string|in:general,help,feedback,showcase,development,bug-reports,feature-requests,off-topic',
            'tags' => 'array|max:5',
            'tags.*' => 'string|max:30',
        ]);

        // Verify game ownership if game_id is provided
        if ($validated['game_id']) {
            $game = Game::findOrFail($validated['game_id']);
            if ($game->user_id !== Auth::id()) {
                abort(403, 'You can only link discussions to your own games.');
            }
        }

        $discussion->update($validated);

        return redirect()->route('forum.show', $discussion)
            ->with('success', 'Discussion updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Discussion $discussion)
    {
        $this->authorize('delete', $discussion);

        $discussion->delete();

        return redirect()->route('forum.index')
            ->with('success', 'Discussion deleted successfully!');
    }
}
