<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $totalUsers = User::count();
        $adminUsers = User::where('role', 'admin')->count();
        $regularUsers = User::where('role', 'user')->orWhereNull('role')->count();
        $recentUsers = User::latest()->take(5)->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'adminUsers' => $adminUsers,
                'regularUsers' => $regularUsers,
            ],
            'recentUsers' => $recentUsers,
        ]);
    }
}
