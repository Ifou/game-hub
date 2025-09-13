import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User, Discussion, Game } from '@/types';

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
    discussions: {
        data: Array<Discussion & {
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

const categoryColors = {
    'general': 'bg-gray-100 text-gray-800',
    'game-dev': 'bg-blue-100 text-blue-800',
    'showcase': 'bg-purple-100 text-purple-800',
    'feedback': 'bg-green-100 text-green-800',
    'help': 'bg-yellow-100 text-yellow-800',
    'off-topic': 'bg-pink-100 text-pink-800',
};

export default function UserForumIndex({ profileUser, discussions, userGames, filters, auth }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedGame, setSelectedGame] = useState(filters.game || '');

    const handleFilter = () => {
        router.get(route('users.forum', profileUser.id), {
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
        router.get(route('users.forum', profileUser.id), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const isOwnForum = auth.user?.id === profileUser.id;

    return (
        <AppLayout>
            <Head title={`${profileUser.name}'s Forum`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {profileUser.name}'s Forum
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        Game development discussions and community
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
                                    <span className="text-blue-600 font-medium">
                                        Forum
                                    </span>
                                    <Link
                                        href={route('users.updates', profileUser.id)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Updates
                                    </Link>
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
                                            placeholder="Search discussions..."
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

                                {/* Create Discussion Button */}
                                {isOwnForum && (
                                    <Link
                                        href={route('users.forum.create', profileUser.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        New Discussion
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Discussions List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {discussions.data.length > 0 ? (
                                <div className="space-y-4">
                                    {discussions.data.map((discussion) => (
                                        <div
                                            key={discussion.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[discussion.category as keyof typeof categoryColors]
                                                                }`}
                                                        >
                                                            {discussion.category.replace('-', ' ')}
                                                        </span>

                                                        {discussion.game && (
                                                            <span className="text-xs text-gray-500">
                                                                • {discussion.game.title}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Link
                                                        href={route('users.forum.show', [profileUser.id, discussion.id])}
                                                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                                    >
                                                        {discussion.title}
                                                    </Link>

                                                    <p className="mt-2 text-gray-600 line-clamp-2">
                                                        {discussion.content}
                                                    </p>

                                                    <div className="mt-3 flex items-center text-sm text-gray-500 space-x-4">
                                                        <span>{discussion.comments_count} replies</span>
                                                        <span>
                                                            {timeAgo(discussion.created_at)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Edit/Delete buttons for own discussions */}
                                                {isOwnForum && (
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <Link
                                                            href={route('users.forum.edit', [profileUser.id, discussion.id])}
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this discussion?')) {
                                                                    router.delete(route('users.forum.destroy', [profileUser.id, discussion.id]));
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
                                        {filters.search || filters.game ? 'No discussions match your filters.' : 'No discussions yet.'}
                                    </div>
                                    {isOwnForum && !filters.search && !filters.game && (
                                        <Link
                                            href={route('users.forum.create', profileUser.id)}
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Start Your First Discussion
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {discussions.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-2">
                                        {discussions.links.map((link, index) => (
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
