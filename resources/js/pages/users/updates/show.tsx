import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { User, Update, Game, Comment } from '@/types';

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
    update: Update & {
        game?: Game;
        comments: Comment[];
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

export default function UserUpdatesShow({ profileUser, update, auth }: Props) {
    const [showCommentForm, setShowCommentForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        commentable_type: 'App\\Models\\Update',
        commentable_id: update.id.toString(),
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('comments.store'), {
            onSuccess: () => {
                reset();
                setShowCommentForm(false);
            },
        });
    };

    const isOwnUpdate = auth.user?.id === update.user_id;

    return (
        <AppLayout>
            <Head title={`${update.title} - ${profileUser.name}'s Updates`} />

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
                            <span className="text-gray-900">{update.title}</span>
                        </nav>
                    </div>

                    {/* Update */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors[update.type as keyof typeof typeColors]
                                                }`}
                                        >
                                            {update.type}
                                        </span>

                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${importanceColors[update.importance as keyof typeof importanceColors]
                                                }`}
                                        >
                                            {update.importance} priority
                                        </span>

                                        {update.game && (
                                            <Link
                                                href={route('games.show', update.game.id)}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100"
                                            >
                                                {update.game.title}
                                            </Link>
                                        )}
                                    </div>

                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                        {update.title}
                                    </h1>

                                    <div className="flex items-center text-sm text-gray-500 mb-6">
                                        <Link
                                            href={route('users.show', profileUser.id)}
                                            className="font-medium text-gray-900 hover:text-blue-600"
                                        >
                                            {profileUser.name}
                                        </Link>
                                        <span className="mx-2">•</span>
                                        <span>{timeAgo(update.created_at)}</span>
                                    </div>
                                </div>

                                {/* Edit/Delete buttons */}
                                {isOwnUpdate && (
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={route('users.updates.edit', [profileUser.id, update.id])}
                                            className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm border border-blue-300 rounded-md hover:bg-blue-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this update?')) {
                                                    router.delete(route('users.updates.destroy', [profileUser.id, update.id]));
                                                }
                                            }}
                                            className="px-3 py-1 text-red-600 hover:text-red-800 text-sm border border-red-300 rounded-md hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="prose max-w-none">
                                <div className="text-gray-700 whitespace-pre-wrap">
                                    {update.content}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Comments ({update.comments.length})
                                </h2>

                                {auth.user && (
                                    <button
                                        onClick={() => setShowCommentForm(!showCommentForm)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Add Comment
                                    </button>
                                )}
                            </div>

                            {/* Comment Form */}
                            {showCommentForm && auth.user && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <form onSubmit={handleCommentSubmit}>
                                        <div className="mb-4">
                                            <textarea
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                placeholder="Write your comment..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                rows={4}
                                                required
                                            />
                                            {errors.content && (
                                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                            >
                                                {processing ? 'Posting...' : 'Post Comment'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setShowCommentForm(false)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Comments List */}
                            {update.comments.length > 0 ? (
                                <div className="space-y-6">
                                    {update.comments.map((comment) => (
                                        <div key={comment.id} className="flex space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {comment.user ? (
                                                        <Link
                                                            href={route('users.show', comment.user.id)}
                                                            className="font-medium text-gray-900 hover:text-blue-600"
                                                        >
                                                            {comment.user.name}
                                                        </Link>
                                                    ) : (
                                                        <span className="font-medium text-gray-900">Unknown User</span>
                                                    )}
                                                    <span className="text-sm text-gray-500">
                                                        {timeAgo(comment.created_at)}
                                                    </span>
                                                </div>

                                                <p className="text-gray-700 whitespace-pre-wrap">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No comments yet. {auth.user && 'Be the first to comment!'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
