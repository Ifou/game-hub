<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display the user's profile.
     */
    public function show(User $user)
    {
        return Inertia::render('users/show', [
            'profileUser' => $user->load(['games' => function($query) {
                $query->published()->latest()->take(6);
            }]),
            'stats' => [
                'totalGames' => $user->games()->published()->count(),
                'totalDiscussions' => $user->discussions()->count(),
                'totalComments' => Comment::where('user_id', $user->id)->count(),
                'joinedAt' => $user->created_at->format('F Y'),
            ],
        ]);
    }

    /**
     * Display the user's games.
     */
    public function games(User $user, Request $request)
    {
        $games = $user->games()
            ->published()
            ->with('user')
            ->when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->sort, function($query, $sort) {
                switch($sort) {
                    case 'downloads':
                        $query->orderBy('downloads_count', 'desc');
                        break;
                    case 'oldest':
                        $query->oldest();
                        break;
                    case 'title':
                        $query->orderBy('title');
                        break;
                    default:
                        $query->latest();
                }
            }, function($query) {
                $query->latest();
            })
            ->paginate(12);

        return Inertia::render('users/games', [
            'profileUser' => $user,
            'games' => $games,
            'filters' => [
                'search' => $request->search,
                'sort' => $request->sort,
            ],
        ]);
    }

    /**
     * Display the user's forum discussions.
     */
    public function discussions(User $user, Request $request)
    {
        $discussions = $user->discussions()
            ->with(['user', 'game', 'comments'])
            ->when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->game, function($query, $gameId) {
                $query->where('game_id', $gameId);
            })
            ->latest()
            ->paginate(10);

        // Get user's games for filtering
        $userGames = $user->games()->published()->select('id', 'title')->get();

        return Inertia::render('users/discussions', [
            'profileUser' => $user,
            'discussions' => $discussions,
            'userGames' => $userGames,
            'filters' => [
                'search' => $request->search,
                'game' => $request->game,
            ],
        ]);
    }

    /**
     * Display the user's recent activity.
     */
    public function activity(User $user)
    {
        // Get recent comments on discussions and updates
        $recentComments = Comment::where('user_id', $user->id)
            ->with(['commentable' => function($morphTo) {
                $morphTo->morphWith([
                    'App\Models\Discussion' => ['game', 'user'],
                    'App\Models\Update' => ['game', 'user'],
                ]);
            }])
            ->latest()
            ->take(10)
            ->get();

        // Get recent discussions
        $recentDiscussions = $user->discussions()
            ->with(['game', 'comments'])
            ->latest()
            ->take(5)
            ->get();

        // Get recent games
        $recentGames = $user->games()
            ->published()
            ->latest()
            ->take(5)
            ->get();

        // Get recent updates
        $recentUpdates = $user->updates()
            ->with(['game', 'comments'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('users/activity', [
            'profileUser' => $user,
            'recentComments' => $recentComments,
            'recentDiscussions' => $recentDiscussions,
            'recentGames' => $recentGames,
            'recentUpdates' => $recentUpdates,
        ]);
    }

    /**
     * Display the user's forum.
     */
    public function forum(User $user, Request $request)
    {
        // Debug: Let's see what user we're dealing with
        Log::info('UserController@forum called for user:', [
            'user_id' => $user->id,
            'user_name' => $user->name
        ]);

        $discussions = $user->discussions()
            ->with(['user', 'game', 'comments'])
            ->when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->game, function($query, $gameId) {
                $query->where('game_id', $gameId);
            })
            ->latest()
            ->paginate(10);

        // Debug: Let's see what discussions we're getting
        Log::info('UserController@forum query result:', [
            'discussions_count' => $discussions->count(),
            'discussions_data' => $discussions->items()
        ]);

        // Get user's games for filtering
        $userGames = $user->games()->published()->select('id', 'title')->get();        return Inertia::render('users/forum/index', [
            'profileUser' => $user,
            'discussions' => $discussions,
            'userGames' => $userGames,
            'filters' => [
                'search' => $request->search,
                'game' => $request->game,
            ],
        ]);
    }

    /**
     * Show a specific discussion in the user's forum.
     */
    public function forumShow(User $user, $discussionId)
    {
        $discussion = $user->discussions()
            ->with(['user', 'game', 'comments.user'])
            ->findOrFail($discussionId);

        return Inertia::render('users/forum/show', [
            'profileUser' => $user,
            'discussion' => $discussion,
        ]);
    }

    /**
     * Show the form for creating a new discussion in the user's forum.
     */
    public function forumCreate(User $user)
    {
        // Check if current user is the profile user or has permission
        if (Auth::id() !== $user->id) {
            abort(403, 'You can only create discussions on your own forum.');
        }

        $userGames = $user->games()->published()->select('id', 'title')->get();

        return Inertia::render('users/forum/create', [
            'profileUser' => $user,
            'userGames' => $userGames,
        ]);
    }

    /**
     * Store a new discussion in the user's forum.
     */
    public function forumStore(User $user, Request $request)
    {
        // Check if current user is the profile user
        if (Auth::id() !== $user->id) {
            abort(403, 'You can only create discussions on your own forum.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'game_id' => 'nullable|exists:games,id',
            'category' => 'required|string|in:general,game-dev,showcase,feedback,help,off-topic',
        ]);

        // Ensure the game belongs to the user if specified
        if ($validated['game_id']) {
            $game = $user->games()->where('id', $validated['game_id'])->first();
            if (!$game) {
                abort(403, 'You can only create discussions for your own games.');
            }
        }

        $discussion = $user->discussions()->create($validated);

        return redirect()->route('users.forum.show', [$user, $discussion]);
    }

    /**
     * Show the form for editing a discussion in the user's forum.
     */
    public function forumEdit(User $user, $discussionId)
    {
        $discussion = $user->discussions()->findOrFail($discussionId);

        // Check if current user is the discussion owner
        if (Auth::id() !== $discussion->user_id) {
            abort(403, 'You can only edit your own discussions.');
        }

        $userGames = $user->games()->published()->select('id', 'title')->get();

        return Inertia::render('users/forum/edit', [
            'profileUser' => $user,
            'discussion' => $discussion,
            'userGames' => $userGames,
        ]);
    }

    /**
     * Update a discussion in the user's forum.
     */
    public function forumUpdate(User $user, $discussionId, Request $request)
    {
        $discussion = $user->discussions()->findOrFail($discussionId);

        // Check if current user is the discussion owner
        if (Auth::id() !== $discussion->user_id) {
            abort(403, 'You can only edit your own discussions.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'game_id' => 'nullable|exists:games,id',
            'category' => 'required|string|in:general,game-dev,showcase,feedback,help,off-topic',
        ]);

        // Ensure the game belongs to the user if specified
        if ($validated['game_id']) {
            $game = $user->games()->where('id', $validated['game_id'])->first();
            if (!$game) {
                abort(403, 'You can only link discussions to your own games.');
            }
        }

        $discussion->update($validated);

        return redirect()->route('users.forum.show', [$user, $discussion]);
    }

    /**
     * Delete a discussion from the user's forum.
     */
    public function forumDestroy(User $user, $discussionId)
    {
        $discussion = $user->discussions()->findOrFail($discussionId);

        // Check if current user is the discussion owner
        if (Auth::id() !== $discussion->user_id) {
            abort(403, 'You can only delete your own discussions.');
        }

        $discussion->delete();

        return redirect()->route('users.forum', $user);
    }

    /**
     * Display the user's updates.
     */
    public function updates(User $user, Request $request)
    {
        $updates = $user->updates()
            ->with(['user', 'game', 'comments'])
            ->when($request->search, function($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($request->game, function($query, $gameId) {
                $query->where('game_id', $gameId);
            })
            ->latest()
            ->paginate(10);

        // Get user's games for filtering
        $userGames = $user->games()->published()->select('id', 'title')->get();

        return Inertia::render('users/updates/index', [
            'profileUser' => $user,
            'updates' => $updates,
            'userGames' => $userGames,
            'filters' => [
                'search' => $request->search,
                'game' => $request->game,
            ],
        ]);
    }

    /**
     * Show a specific update.
     */
    public function updatesShow(User $user, $updateId)
    {
        $update = $user->updates()
            ->with(['user', 'game', 'comments.user'])
            ->findOrFail($updateId);

        return Inertia::render('users/updates/show', [
            'profileUser' => $user,
            'update' => $update,
        ]);
    }

    /**
     * Show the form for creating a new update.
     */
    public function updatesCreate(User $user)
    {
        // Check if current user is the profile user
        if (Auth::id() !== $user->id) {
            abort(403, 'You can only create updates on your own profile.');
        }

        $userGames = $user->games()->published()->select('id', 'title')->get();

        return Inertia::render('users/updates/create', [
            'profileUser' => $user,
            'userGames' => $userGames,
        ]);
    }

    /**
     * Store a new update.
     */
    public function updatesStore(User $user, Request $request)
    {
        // Check if current user is the profile user
        if (Auth::id() !== $user->id) {
            abort(403, 'You can only create updates on your own profile.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'game_id' => 'nullable|exists:games,id',
            'type' => 'required|string|in:update,patch,hotfix,announcement,news',
            'importance' => 'required|string|in:low,medium,high,critical',
        ]);

        // Ensure the game belongs to the user if specified
        if ($validated['game_id']) {
            $game = $user->games()->where('id', $validated['game_id'])->first();
            if (!$game) {
                abort(403, 'You can only create updates for your own games.');
            }
        }

        $update = $user->updates()->create($validated);

        return redirect()->route('users.updates.show', [$user, $update]);
    }

    /**
     * Show the form for editing an update.
     */
    public function updatesEdit(User $user, $updateId)
    {
        $update = $user->updates()->findOrFail($updateId);

        // Check if current user is the update owner
        if (Auth::id() !== $update->user_id) {
            abort(403, 'You can only edit your own updates.');
        }

        $userGames = $user->games()->published()->select('id', 'title')->get();

        return Inertia::render('users/updates/edit', [
            'profileUser' => $user,
            'update' => $update,
            'userGames' => $userGames,
        ]);
    }

    /**
     * Update an existing update.
     */
    public function updatesUpdate(User $user, $updateId, Request $request)
    {
        $update = $user->updates()->findOrFail($updateId);

        // Check if current user is the update owner
        if (Auth::id() !== $update->user_id) {
            abort(403, 'You can only edit your own updates.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'game_id' => 'nullable|exists:games,id',
            'type' => 'required|string|in:update,patch,hotfix,announcement,news',
            'importance' => 'required|string|in:low,medium,high,critical',
        ]);

        // Ensure the game belongs to the user if specified
        if ($validated['game_id']) {
            $game = $user->games()->where('id', $validated['game_id'])->first();
            if (!$game) {
                abort(403, 'You can only link updates to your own games.');
            }
        }

        $update->update($validated);

        return redirect()->route('users.updates.show', [$user, $update]);
    }

    /**
     * Delete an update.
     */
    public function updatesDestroy(User $user, $updateId)
    {
        $update = $user->updates()->findOrFail($updateId);

        // Check if current user is the update owner
        if (Auth::id() !== $update->user_id) {
            abort(403, 'You can only delete your own updates.');
        }

        $update->delete();

        return redirect()->route('users.updates', $user);
    }
}
