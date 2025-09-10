<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\UpdateController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\DiscussionReplyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    try {
        $featuredGames = \App\Models\Game::published()
            ->featured()
            ->with('user')
            ->latest()
            ->take(3)
            ->get();

        $popularGames = \App\Models\Game::published()
            ->with('user')
            ->orderBy('downloads_count', 'desc')
            ->take(8)
            ->get();

        $totalGames = \App\Models\Game::published()->count();
        $totalUsers = \App\Models\User::count();
        $totalDownloads = \App\Models\Game::published()->sum('downloads_count');
    } catch (\Exception $e) {
        $featuredGames = collect([]);
        $popularGames = collect([]);
        $totalGames = 0;
        $totalUsers = 0;
        $totalDownloads = 0;
    }

    return Inertia::render('welcome', [
        'featuredGames' => $featuredGames,
        'popularGames' => $popularGames,
        'stats' => [
            'totalGames' => $totalGames,
            'totalUsers' => $totalUsers,
            'totalDownloads' => $totalDownloads,
        ]
    ]);
})->name('home');

// Games browsing page with search and filters
Route::get('/browse', function (Request $request) {
    try {
        $query = \App\Models\Game::published()
            ->with('user')
            ->latest();

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($userQuery) use ($request) {
                      $userQuery->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // Filter by category
        if ($request->category && $request->category !== 'all') {
            $query->byCategory($request->category);
        }

        // Sort options
        switch ($request->sort) {
            case 'popular':
                $query->orderBy('downloads_count', 'desc');
                break;
            case 'rated':
                $query->orderBy('average_rating', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        // Filter by featured
        if ($request->featured) {
            $query->featured();
        }

        $games = $query->paginate(12)->withQueryString();

        $featuredGames = \App\Models\Game::published()
            ->featured()
            ->with('user')
            ->latest()
            ->take(3)
            ->get();
    } catch (\Exception $e) {
        $games = new \Illuminate\Pagination\LengthAwarePaginator(
            [],
            0,
            12,
            1,
            ['path' => $request->url(), 'pageName' => 'page']
        );
        $games->withQueryString();

        $featuredGames = collect([]);
    }

    $categories = [
        'all' => 'All Games',
        'action' => 'Action',
        'adventure' => 'Adventure',
        'puzzle' => 'Puzzle',
        'strategy' => 'Strategy',
        'rpg' => 'RPG',
        'simulation' => 'Simulation',
        'sports' => 'Sports',
        'racing' => 'Racing',
        'platformer' => 'Platformer',
        'other' => 'Other'
    ];

    return Inertia::render('games/browse', [
        'games' => $games,
        'featuredGames' => $featuredGames,
        'categories' => $categories,
        'filters' => $request->only(['search', 'category', 'sort', 'featured']),
    ]);
})->name('games.browse');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // User Profile Routes
    Route::get('/profile', function () {
        $user = request()->user();
        return Inertia::render('profile', [
            'user' => $user,
            'gamesCount' => $user->games()->count(),
            'forumPostsCount' => $user->discussions()->count() + $user->discussionReplies()->count(),
            'updatesCount' => $user->updates()->count(),
        ]);
    })->name('profile');

    // Game Routes - Protected routes first (create, edit, update, delete)
    Route::get('/games/create', [GameController::class, 'create'])->name('games.create');
    Route::post('/games', [GameController::class, 'store'])->name('games.store');
    Route::get('/games/{game}/edit', [GameController::class, 'edit'])->name('games.edit');
    Route::put('/games/{game}', [GameController::class, 'update'])->name('games.update');
    Route::delete('/games/{game}', [GameController::class, 'destroy'])->name('games.destroy');
    Route::get('/games/{game}/download', [GameController::class, 'download'])->name('games.download');
});

// Public game routes (accessible to everyone) - Place after protected routes
Route::get('/games', [GameController::class, 'index'])->name('games.index');
Route::get('/games/{game}', [GameController::class, 'show'])->name('games.show');

Route::middleware(['auth', 'verified'])->group(function () {
    // Update Routes
    Route::resource('updates', UpdateController::class);

    // Forum Routes (mapped to discussions)
    Route::get('/forum', [DiscussionController::class, 'index'])->name('forum.index');
    Route::get('/forum/create', [DiscussionController::class, 'create'])->name('forum.create');
    Route::post('/forum', [DiscussionController::class, 'store'])->name('forum.store');
    Route::get('/forum/{discussion}', [DiscussionController::class, 'show'])->name('forum.show');
    Route::get('/forum/{discussion}/edit', [DiscussionController::class, 'edit'])->name('forum.edit');
    Route::put('/forum/{discussion}', [DiscussionController::class, 'update'])->name('forum.update');
    Route::delete('/forum/{discussion}', [DiscussionController::class, 'destroy'])->name('forum.destroy');

    // Discussion Reply Routes
    Route::post('/forum/{discussion}/replies', [DiscussionReplyController::class, 'store'])->name('forum.replies.store');
    Route::put('/replies/{reply}', [DiscussionReplyController::class, 'update'])->name('replies.update');
    Route::delete('/replies/{reply}', [DiscussionReplyController::class, 'destroy'])->name('replies.destroy');
    Route::post('/replies/{reply}/vote', [DiscussionReplyController::class, 'vote'])->name('replies.vote');

    // Settings Route
    Route::get('/settings', function () {
        return Inertia::render('settings', [
            'user' => request()->user(),
        ]);
    })->name('settings');

    // Temporary test route for debugging
    Route::get('/test-admin-users', function () {
        $users = App\Models\User::paginate(15);
        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => ['search' => '', 'role' => ''],
        ]);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
