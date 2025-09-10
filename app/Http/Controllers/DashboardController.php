<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Update;
use App\Models\Discussion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index()
    {
        $user = Auth::user();

        // Get user's statistics
        $userStats = [
            'totalGames' => $user->games()->published()->count(),
            'totalUpdates' => $user->updates()->published()->count(),
            'totalDiscussions' => $user->discussions()->count(),
            'totalReplies' => $user->discussionReplies()->count(),
            'totalDownloads' => $user->games()->published()->sum('downloads_count'),
            'totalViews' => $user->games()->published()->sum('views_count') +
                          $user->updates()->published()->sum('views_count') +
                          $user->discussions()->sum('views_count'),
        ];

        // Get recent activities
        $recentGames = $user->games()
            ->published()
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        $recentUpdates = $user->updates()
            ->published()
            ->with(['user', 'game'])
            ->latest()
            ->take(5)
            ->get();

        $recentDiscussions = $user->discussions()
            ->with(['user', 'game'])
            ->latest()
            ->take(5)
            ->get();

        // Get popular games (user's games ordered by downloads)
        $popularGames = $user->games()
            ->published()
            ->orderBy('downloads_count', 'desc')
            ->take(3)
            ->get();

        // Get platform statistics
        $platformStats = [
            'totalUsers' => User::count(),
            'totalGamesOnPlatform' => Game::published()->count(),
            'totalUpdatesOnPlatform' => Update::published()->count(),
            'totalDiscussionsOnPlatform' => Discussion::count(),
        ];

        return Inertia::render('dashboard', [
            'stats' => $userStats,
            'platformStats' => $platformStats,
            'recentGames' => $recentGames,
            'recentUpdates' => $recentUpdates,
            'recentDiscussions' => $recentDiscussions,
            'popularGames' => $popularGames,
        ]);
    }
}
