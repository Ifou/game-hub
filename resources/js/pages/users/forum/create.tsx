import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User, Game } from '@/types';

interface Props {
    profileUser: User;
    userGames: Game[];
    auth: {
        user: User;
    };
}

export default function UserForumCreate({ profileUser, userGames, auth }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: 'general',
        game_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.forum.store', profileUser.id));
    };

    return (
        <AppLayout>
            <Head title={`New Discussion - ${profileUser.name}'s Forum`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <nav className="flex space-x-2 text-sm text-gray-500">
                            <Link href={route('users.show', profileUser.id)} className="hover:text-gray-700">
                                {profileUser.name}
                            </Link>
                            <span>/</span>
                            <Link href={route('users.forum', profileUser.id)} className="hover:text-gray-700">
                                Forum
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900">New Discussion</span>
                        </nav>
                    </div>

                    {/* Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                                Create New Discussion
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
                                        placeholder="Enter discussion title..."
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Category and Game */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value as 'general' | 'game-dev' | 'showcase' | 'feedback' | 'help' | 'off-topic')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="general">General</option>
                                            <option value="game-dev">Game Development</option>
                                            <option value="showcase">Showcase</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="help">Help</option>
                                            <option value="off-topic">Off Topic</option>
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
                                        rows={8}
                                        placeholder="What would you like to discuss?"
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
                                        {processing ? 'Creating...' : 'Create Discussion'}
                                    </button>

                                    <Link
                                        href={route('users.forum', profileUser.id)}
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
