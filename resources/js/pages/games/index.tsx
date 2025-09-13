import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData, type Game } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Edit,
    Eye,
    Gamepad2,
    Plus,
    Search,
    Star,
    Trash2,
    Users
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Props extends SharedData {
    games: {
        data: Game[];
        links?: any;
        meta?: any;
    } | Game[];
    isMyGames?: boolean;
    categories?: string[] | { [key: string]: string };
    filters?: {
        search?: string;
        category?: string;
        sort?: string;
        featured?: boolean;
    };
}

export default function Index({
    games: rawGames,
    isMyGames = false,
    categories,
    filters = {}
}: Props) {
    // Normalize games data - handle both paginated and array formats
    const games = Array.isArray(rawGames) ? rawGames : rawGames.data;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: isMyGames ? 'My Games' : 'All Games',
            href: isMyGames ? '/my-games' : '/games',
        },
    ];

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;

        const url = isMyGames ? '/my-games' : '/games';
        router.get(url, { search }, { preserveState: true });
    };

    const handleDelete = (gameId: number) => {
        if (confirm('Are you sure you want to delete this game?')) {
            router.delete(`/games/${gameId}`, {
                onSuccess: () => {
                    // Refresh the page
                    router.reload();
                }
            });
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={isMyGames ? "My Games" : "All Games"} />

            <div className={`${isMyGames ? 'w-full' : 'max-w-7xl mx-auto'} p-6`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {isMyGames ? "My Games" : "All Games"}
                        </h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            {isMyGames
                                ? "Manage and track your uploaded games"
                                : "Discover and download games from the community"
                            }
                        </p>
                    </div>
                    {isMyGames && (
                        <Link
                            href="/games/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Upload Game
                        </Link>
                    )}
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-3 text-slate-400" />
                        <input
                            name="search"
                            type="text"
                            placeholder={isMyGames ? "Search your games..." : "Search all games..."}
                            defaultValue={filters.search || ''}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </form>

                {/* Games Grid */}
                {games.length === 0 ? (
                    <div className="text-center py-16">
                        <Gamepad2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            {isMyGames ? "No games uploaded yet" : "No games available"}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            {isMyGames
                                ? "Start by uploading your first game to share with the community"
                                : "No games have been published yet. Check back later!"
                            }
                        </p>
                        {isMyGames && (
                            <Link
                                href="/games/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Upload Your First Game
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map((game) => (
                            <div key={game.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 relative">
                                    {game.thumbnail_path ? (
                                        <img
                                            src={`/storage/${game.thumbnail_path}`}
                                            alt={game.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center">
                                            <Gamepad2 className="h-16 w-16 text-white/80" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-700 capitalize">
                                            {game.category}
                                        </span>
                                    </div>
                                    {game.is_featured && (
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 truncate">
                                        {game.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 h-10 overflow-hidden">
                                        {game.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Download className="h-4 w-4" />
                                            <span>{game.downloads_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{game.views_count}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>{new Date(game.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {isMyGames ? (
                                            <>
                                                <Link
                                                    href={`/games/${game.id}/edit`}
                                                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/games/${game.id}`}
                                                    className="flex-1 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(game.id)}
                                                    className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href={`/games/${game.id}`}
                                                    className="flex-1 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/games/${game.id}/download`}
                                                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppSidebarLayout>
    );
}
