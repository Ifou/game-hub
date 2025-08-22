<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

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
