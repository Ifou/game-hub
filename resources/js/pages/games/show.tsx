import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Download,
    Edit,
    Eye,
    Gamepad2,
    MessageSquare,
    Star,
    Tag,
    Trash2,
    User,
    Users
} from 'lucide-react';
import { useState } from 'react';

interface Game {
    id: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    version: string;
    min_players: number | null;
    max_players: number | null;
    file_path: string;
    thumbnail_path: string | null;
    downloads_count: number;
    views_count: number;
    rating: number | null;
    status: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props extends SharedData {
    game: Game;
    relatedGames: Game[];
}

export default function ShowGame({ auth, game, relatedGames }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Browse Games',
            href: '/browse',
        },
        {
            title: game.title,
            href: `/games/${game.id}`,
        },
    ];

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
            setIsDeleting(true);
            router.delete(`/games/${game.id}`, {
                onSuccess: () => {
                    // Will redirect automatically
                },
                onError: () => {
                    setIsDeleting(false);
                },
            });
        }
    };

    const isOwner = auth.user?.id === game.user.id;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={game.title} />

            <div className="max-w-6xl mx-auto p-6">
                {/* Back Button */}
                <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Browse
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Game Header */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                        {game.title}
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            <Link
                                                href={`/users/${game.user.id}`}
                                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {game.user.name}
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(game.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            {game.views_count} views
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {isOwner && (
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/games/${game.id}/edit`}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Game Thumbnail */}
                            {game.thumbnail_path && (
                                <div className="mb-6">
                                    <img
                                        src={`/storage/${game.thumbnail_path}`}
                                        alt={game.title}
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                                    Description
                                </h2>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {game.description}
                                </p>
                            </div>

                            {/* Tags */}
                            {game.tags.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-3">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {game.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                                            >
                                                <Tag className="h-3 w-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Download Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            {auth?.user ? (
                                <a
                                    href={`/games/${game.id}/download`}
                                    className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium py-3 px-4 rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 mb-4 no-underline"
                                >
                                    <Download className="h-5 w-5" />
                                    Download Game
                                </a>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href="/login"
                                        className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium py-3 px-4 rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="h-5 w-5" />
                                        Login to Download
                                    </Link>
                                    <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                                        Free account required to download games
                                    </p>
                                </div>
                            )}

                            <div className="text-center text-sm text-slate-600 dark:text-slate-300">
                                {game.downloads_count} downloads
                            </div>
                        </div>

                        {/* Game Info */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Game Info</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Category:</span>
                                    <span className="text-slate-900 dark:text-white capitalize">{game.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Version:</span>
                                    <span className="text-slate-900 dark:text-white">{game.version}</span>
                                </div>
                                {(game.min_players || game.max_players) && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Players:</span>
                                        <span className="text-slate-900 dark:text-white">
                                            {game.min_players && game.max_players
                                                ? `${game.min_players}-${game.max_players}`
                                                : game.min_players || game.max_players}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Released:</span>
                                    <span className="text-slate-900 dark:text-white">
                                        {new Date(game.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Related Games */}
                        {relatedGames.length > 0 && (
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Similar Games</h3>
                                <div className="space-y-3">
                                    {relatedGames.map((relatedGame) => (
                                        <Link
                                            key={relatedGame.id}
                                            href={`/games/${relatedGame.id}`}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {relatedGame.thumbnail_path ? (
                                                <img
                                                    src={`/storage/${relatedGame.thumbnail_path}`}
                                                    alt={relatedGame.title}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center">
                                                    <Gamepad2 className="h-5 w-5 text-slate-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                    {relatedGame.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    by <Link
                                                        href={`/users/${relatedGame.user.id}`}
                                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {relatedGame.user.name}
                                                    </Link>
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
