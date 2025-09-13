import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User, Update, Game } from '@/types';

// Simple relative time helper
function timeAgo(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

interface Props {
    profileUser: User;
    updates: {
        data: Array<Update & {
            game?: Game;
            comments_count: number;
        }>;
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    userGames: Game[];
    filters: {
        search?: string;
        game?: string;
    };
    auth: {
        user: User;
    };
}

const typeColors = {
    'update': 'bg-blue-100 text-blue-800',
    'patch': 'bg-green-100 text-green-800',
    'hotfix': 'bg-red-100 text-red-800',
    'announcement': 'bg-purple-100 text-purple-800',
    'news': 'bg-yellow-100 text-yellow-800',
};

const importanceColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
};

export default function UserUpdatesIndex({ profileUser, updates, userGames, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedGame, setSelectedGame] = useState(filters.game || '');

    const handleFilter = () => {
        router.get(route('users.updates', profileUser.id), {
            search: search || undefined,
            game: selectedGame || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedGame('');
        router.get(route('users.updates', profileUser.id), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const isOwnProfile = auth.user?.id === profileUser.id;

    return (
        <AppLayout>
            <Head title={`${profileUser.name}'s Updates`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {profileUser.name}'s Updates
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        Latest news and updates from {profileUser.name}
                                    </p>
                                </div>

                                {/* Navigation */}
                                <div className="flex space-x-4">
                                    <Link
                                        href={route('users.show', profileUser.id)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route('users.games', profileUser.id)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Games
                                    </Link>
                                    <Link
                                        href={route('users.forum', profileUser.id)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Forum
                                    </Link>
                                    <span className="text-blue-600 font-medium">
                                        Updates
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                {/* Filters */}
                                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                    <div className="flex-1 max-w-sm">
                                        <input
                                            type="text"
                                            placeholder="Search updates..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                        />
                                    </div>

                                    <select
                                        value={selectedGame}
                                        onChange={(e) => setSelectedGame(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Games</option>
                                        {userGames.map((game) => (
                                            <option key={game.id} value={game.id}>
                                                {game.title}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleFilter}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Filter
                                        </button>

                                        {(filters.search || filters.game) && (
                                            <button
                                                onClick={handleReset}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                Reset
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Create Update Button */}
                                {isOwnProfile && (
                                    <Link
                                        href={route('users.updates.create', profileUser.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        New Update
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Updates List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {updates.data.length > 0 ? (
                                <div className="space-y-6">
                                    {updates.data.map((update) => (
                                        <div
                                            key={update.id}
                                            className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[update.type as keyof typeof typeColors]
                                                                }`}
                                                        >
                                                            {update.type}
                                                        </span>

                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${importanceColors[update.importance as keyof typeof importanceColors]
                                                                }`}
                                                        >
                                                            {update.importance}
                                                        </span>

                                                        {update.game && (
                                                            <span className="text-xs text-gray-500">
                                                                • {update.game.title}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Link
                                                        href={route('users.updates.show', [profileUser.id, update.id])}
                                                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
                                                    >
                                                        {update.title}
                                                    </Link>

                                                    <p className="mt-3 text-gray-600 line-clamp-3">
                                                        {update.content}
                                                    </p>

                                                    <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                                                        <span>{update.comments_count} comments</span>
                                                        <span>
                                                            {timeAgo(update.created_at)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Edit/Delete buttons for own updates */}
                                                {isOwnProfile && (
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Link
                                                            href={route('users.updates.edit', [profileUser.id, update.id])}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this update?')) {
                                                                    router.delete(route('users.updates.destroy', [profileUser.id, update.id]));
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 mb-4">
                                        {filters.search || filters.game ? 'No updates match your filters.' : 'No updates yet.'}
                                    </div>
                                    {isOwnProfile && !filters.search && !filters.game && (
                                        <Link
                                            href={route('users.updates.create', profileUser.id)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Create Your First Update
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {updates.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-2">
                                        {updates.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 rounded-md text-sm ${link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
