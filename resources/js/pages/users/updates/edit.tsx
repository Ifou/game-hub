import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User, Update, Game } from '@/types';

interface Props {
    profileUser: User;
    update: Update & {
        game?: Game;
    };
    userGames: Game[];
    auth: {
        user: User;
    };
}

export default function UserUpdatesEdit({ profileUser, update, userGames, auth }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: update.title,
        content: update.content,
        type: update.type,
        importance: update.importance,
        game_id: update.game?.id?.toString() || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.updates.update', [profileUser.id, update.id]));
    };

    return (
        <AppLayout>
            <Head title={`Edit Update - ${profileUser.name}'s Updates`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <nav className="flex space-x-2 text-sm text-gray-500">
                            <Link href={route('users.show', profileUser.id)} className="hover:text-gray-700">
                                {profileUser.name}
                            </Link>
                            <span>/</span>
                            <Link href={route('users.updates', profileUser.id)} className="hover:text-gray-700">
                                Updates
                            </Link>
                            <span>/</span>
                            <Link href={route('users.updates.show', [profileUser.id, update.id])} className="hover:text-gray-700">
                                {update.title}
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900">Edit</span>
                        </nav>
                    </div>

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                                Edit Update
                            </h1>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter update title..."
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Type, Importance, and Game */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                            Type
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value as 'update' | 'patch' | 'hotfix' | 'announcement' | 'news')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="update">Update</option>
                                            <option value="patch">Patch</option>
                                            <option value="hotfix">Hotfix</option>
                                            <option value="announcement">Announcement</option>
                                            <option value="news">News</option>
                                        </select>
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="importance" className="block text-sm font-medium text-gray-700 mb-2">
                                            Importance
                                        </label>
                                        <select
                                            id="importance"
                                            value={data.importance}
                                            onChange={(e) => setData('importance', e.target.value as 'low' | 'medium' | 'high' | 'critical')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="critical">Critical</option>
                                        </select>
                                        {errors.importance && (
                                            <p className="mt-1 text-sm text-red-600">{errors.importance}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="game_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Related Game (Optional)
                                        </label>
                                        <select
                                            id="game_id"
                                            value={data.game_id}
                                            onChange={(e) => setData('game_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">No specific game</option>
                                            {userGames.map((game) => (
                                                <option key={game.id} value={game.id}>
                                                    {game.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.game_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.game_id}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                        Content
                                    </label>
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={10}
                                        placeholder="What's new? Share your update details here..."
                                        required
                                    />
                                    {errors.content && (
                                        <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>

                                    <Link
                                        href={route('users.updates.show', [profileUser.id, update.id])}
                                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
