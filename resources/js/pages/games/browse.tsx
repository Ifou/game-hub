import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, StarIcon } from '@heroicons/react/24/outline';

interface Game {
    id: number;
    title: string;
    description: string;
    category: string;
    downloads_count: number;
    views_count: number;
    average_rating: number;
    total_ratings: number;
    thumbnail_path?: string;
    is_featured: boolean;
    user_id: number;
    user: {
        name: string;
    };
}

interface BrowseGamesProps extends SharedData {
    games: {
        data: Game[];
        links: any[];
        meta: any;
    };
    featuredGames: Game[];
    categories: Record<string, string>;
    filters: {
        search?: string;
        category?: string;
        sort?: string;
        featured?: boolean;
    };
}

export default function BrowseGames() {
    const { auth, games, featuredGames, categories, filters } = usePage<BrowseGamesProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/browse', {
            ...(filters || {}),
            search: searchTerm || undefined,
            page: undefined
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleFilterChange = (key: string, value: any) => {
        router.get('/browse', {
            ...(filters || {}),
            [key]: value === 'all' ? undefined : value,
            page: undefined
        }, {
            preserveState: true,
            replace: true
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/browse', {}, {
            preserveState: true,
            replace: true
        });
    };

    const categoryColors = {
        action: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        adventure: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
        arcade: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
        puzzle: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
        racing: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
        rpg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
        simulation: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        strategy: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        sports: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        platformer: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
        shooter: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
        other: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'
    };

    const gradients = [
        'from-emerald-600 to-cyan-600',
        'from-purple-600 to-pink-600',
        'from-orange-600 to-red-600',
        'from-blue-600 to-indigo-600',
        'from-green-600 to-emerald-600',
        'from-pink-600 to-rose-600',
        'from-indigo-600 to-purple-600',
        'from-cyan-600 to-blue-600'
    ];

    return (
        <>
            <Head title="Browse Games - GameHub">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(180deg); }
                    }
                    @keyframes slowSpin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes gradientShift {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    .animate-float-delayed {
                        animation: float 8s ease-in-out infinite;
                        animation-delay: 2s;
                    }
                    .animate-slow-spin {
                        animation: slowSpin 20s linear infinite;
                    }
                    .animate-gradient {
                        animation: gradientShift 10s ease infinite;
                        background-size: 200% 200%;
                    }
                `}</style>
            </Head>

            <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Moving gradient overlay with darker tones */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-violet-950/40 animate-gradient"></div>

                    {/* Large floating orbs with darker colors */}
                    <div className="absolute top-20 right-16 w-96 h-96 bg-gradient-to-br from-purple-800/8 to-pink-800/8 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-32 left-16 w-80 h-80 bg-gradient-to-br from-indigo-800/8 to-cyan-800/8 rounded-full blur-3xl animate-float-delayed"></div>
                    <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-violet-800/6 to-purple-800/6 rounded-full blur-2xl animate-slow-spin"></div>

                    {/* Subtle floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-violet-400/60 rounded-full animate-float"></div>
                    <div className="absolute top-1/6 right-1/4 w-1 h-1 bg-indigo-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
                    <div className="absolute bottom-1/4 left-1/5 w-1 h-1 bg-purple-400/40 rounded-full animate-float-delayed"></div>
                    <div className="absolute top-2/3 right-1/5 w-1 h-1 bg-cyan-400/45 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
                    <div className="absolute bottom-1/6 right-1/3 w-1 h-1 bg-pink-400/35 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute top-5/6 left-1/3 w-1 h-1 bg-violet-400/40 rounded-full animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>

                    {/* Very subtle grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px] animate-pulse" style={{ animationDuration: '15s' }}></div>
                </div>
                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between p-6 lg:px-8 border-b border-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.859 0-7 3.141-7 7v1h1 1 14z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">GameHub</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="text-sm font-medium text-blue-100 transition-colors hover:text-white"
                        >
                            Home
                        </Link>
                        {auth.user ? (
                            <>
                                <Link
                                    href="/games/create"
                                    className="text-sm font-medium text-blue-100 transition-colors hover:text-white"
                                >
                                    Upload Game
                                </Link>
                                <Link
                                    href="/profile"
                                    className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                                >
                                    My Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-blue-100 transition-colors hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                                >
                                    Join GameHub
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 relative z-10">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
                            Browse Games
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg leading-8 text-blue-100">
                            Discover amazing games from talented developers around the world. Use filters to find exactly what you're looking for.
                        </p>
                    </div>

                    {/* Featured Games */}
                    {featuredGames && featuredGames.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Featured Games</h2>
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-8">
                                {featuredGames.slice(0, 6).map((game, index) => (
                                    <Link
                                        key={game.id}
                                        href={route('games.show', game.id)}
                                        className="group cursor-pointer rounded-xl backdrop-blur-sm bg-white/10 p-6 shadow-xl ring-1 ring-white/20 transition-all hover:shadow-2xl hover:ring-2 hover:ring-orange-400/50 hover:bg-white/15 border border-white/10"
                                    >
                                        <div className={`mb-4 h-40 rounded-md bg-gradient-to-br ${gradients[index]} relative overflow-hidden`}>
                                            {game.thumbnail_path ? (
                                                <img
                                                    src={`/storage/${game.thumbnail_path}`}
                                                    alt={game.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                                                        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                                    <StarIcon className="w-3 h-3 mr-1" />
                                                    Featured
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-white truncate">{game.title}</h3>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${categoryColors[game.category as keyof typeof categoryColors] || categoryColors.other}`}>
                                                {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-100 mb-2 line-clamp-2">{game.description}</p>
                                        <div className="flex items-center justify-between text-xs text-blue-200">
                                            <span>By <Link
                                                href={`/users/${game.user_id}`}
                                                className="hover:text-white transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {game.user.name}
                                            </Link></span>
                                            <span>{game.downloads_count >= 1000 ? `${Math.round(game.downloads_count / 100) / 10}k` : game.downloads_count} downloads</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-200" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search games, developers..."
                                        className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-white backdrop-blur-sm bg-white/10 shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-blue-200 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                    />
                                </div>
                            </form>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center rounded-lg backdrop-blur-sm bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/15"
                            >
                                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                                Filters
                            </button>
                        </div>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 shadow-sm ring-1 ring-white/20 mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Category</label>
                                        <select
                                            value={filters?.category || 'all'}
                                            onChange={(e) => handleFilterChange('category', e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-slate-900 backdrop-blur-sm bg-white/90 shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                        >
                                            {categories && Object.entries(categories).map(([key, label]) => (
                                                <option key={key} value={key} className="text-slate-900">
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Sort By</label>
                                        <select
                                            value={filters?.sort || 'newest'}
                                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                                            className="block w-full rounded-md border-0 py-1.5 text-slate-900 backdrop-blur-sm bg-white/90 shadow-sm ring-1 ring-inset ring-white/20 focus:ring-2 focus:ring-inset focus:ring-orange-600"
                                        >
                                            <option value="newest" className="text-slate-900">Newest</option>
                                            <option value="popular" className="text-slate-900">Most Popular</option>
                                            <option value="rated" className="text-slate-900">Highest Rated</option>
                                        </select>
                                    </div>

                                    {/* Featured Toggle */}
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Show</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={!!filters?.featured}
                                                    onChange={(e) => handleFilterChange('featured', e.target.checked || undefined)}
                                                    className="rounded border-white/20 text-orange-600 focus:ring-orange-600 bg-white/10"
                                                />
                                                <span className="ml-2 text-sm text-white">Featured only</span>
                                            </label>
                                            <button
                                                onClick={clearFilters}
                                                className="text-sm text-orange-400 hover:text-orange-300"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Games Grid */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">
                                All Games
                                {games?.meta?.total > 0 && (
                                    <span className="text-sm font-normal text-blue-200 ml-2">
                                        ({games.meta.total} games)
                                    </span>
                                )}
                            </h2>
                        </div>

                        {games?.data && games.data.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {games.data.map((game: Game, index: number) => (
                                        <Link
                                            key={game.id}
                                            href={route('games.show', game.id)}
                                            className="group cursor-pointer rounded-xl backdrop-blur-sm bg-white/5 p-6 shadow-xl ring-1 ring-white/10 transition-all hover:shadow-2xl hover:ring-2 hover:ring-orange-300/50 hover:bg-white/10 border border-white/10"
                                        >
                                            <div className={`mb-3 h-32 rounded-md bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}>
                                                {game.thumbnail_path ? (
                                                    <img
                                                        src={`/storage/${game.thumbnail_path}`}
                                                        alt={game.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                                            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M8 5v14l11-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                                {game.is_featured && (
                                                    <div className="absolute top-2 right-2">
                                                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-sm text-white truncate">{game.title}</h3>
                                                <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${categoryColors[game.category as keyof typeof categoryColors] || categoryColors.other}`}>
                                                    {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-blue-100 mb-2 line-clamp-2">{game.description}</p>
                                            <div className="flex items-center justify-between text-xs text-blue-200">
                                                <Link
                                                    href={`/users/${game.user_id}`}
                                                    className="hover:text-white transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {game.user.name}
                                                </Link>
                                                <div className="flex items-center space-x-2">
                                                    {game.total_ratings > 0 && (
                                                        <span className="flex items-center">
                                                            <StarIcon className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                                            {game.average_rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                    <span>{game.downloads_count >= 1000 ? `${Math.round(game.downloads_count / 100) / 10}k` : game.downloads_count} ↓</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {games?.links && games.links.length > 3 && (
                                    <div className="flex items-center justify-center space-x-1 mt-8">
                                        {games.links.map((link, index) => (
                                            <div key={index}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md ${link.active
                                                            ? 'bg-orange-600 text-white'
                                                            : 'text-blue-200 hover:text-white hover:bg-white/10'
                                                            }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        className="px-3 py-2 text-sm font-medium text-blue-300"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-blue-200">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.718 2.172" />
                                    </svg>
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-white">No games found</h3>
                                <p className="mt-1 text-sm text-blue-100">
                                    {filters?.search || filters?.category ? 'Try adjusting your search or filters.' : 'Be the first to upload a game!'}
                                </p>
                                {auth.user && !filters?.search && !filters?.category && (
                                    <div className="mt-6">
                                        <Link
                                            href={route('games.create')}
                                            className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
                                        >
                                            Upload Your First Game
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/20 mt-16 relative z-10">
                    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                        <p className="text-center text-xs leading-5 text-blue-200">
                            &copy; 2025 GameHub. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
