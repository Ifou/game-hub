import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Game {
    id: number;
    title: string;
    description: string;
    category: string;
    downloads_count: number;
    thumbnail_path?: string;
    is_featured: boolean;
    user_id: number;
    user: {
        name: string;
    };
}

interface WelcomeProps extends SharedData {
    featuredGames: Game[];
    popularGames: Game[];
    stats: {
        totalGames: number;
        totalUsers: number;
        totalDownloads: number;
    };
}

export default function Welcome() {
    const { auth, featuredGames, popularGames: popular, stats } = usePage<WelcomeProps>().props;

    const categoryColors = {
        action: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        adventure: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
        puzzle: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
        strategy: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        rpg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
        simulation: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        sports: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        racing: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
        platformer: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
        other: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300'
    };

    const gradients = [
        'from-emerald-400 to-cyan-400',
        'from-purple-400 to-pink-400',
        'from-orange-400 to-red-400',
        'from-blue-400 to-indigo-400',
        'from-green-400 to-emerald-400',
        'from-pink-400 to-rose-400',
        'from-indigo-400 to-purple-400',
        'from-cyan-400 to-blue-400'
    ];

    return (
        <div>
            <Head title="GameHub - Discover Amazing Games">
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
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.859 0-7 3.141-7 7v1h1 1 14z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">GameHub</span>
                        </div>

                        <Link
                            href={route('games.browse')}
                            className="text-sm font-medium text-blue-100 transition-colors hover:text-white"
                        >
                            Browse Games
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route('games.create')}
                                    className="text-sm font-medium text-blue-100 transition-colors hover:text-white"
                                >
                                    Upload Game
                                </Link>
                                <Link
                                    href={route('profile')}
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
                    {/* Hero Section with Stats */}
                    <div className="text-center mb-12 relative">
                        <div className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl"></div>
                        <div className="relative backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-4">
                                Discover Amazing
                                <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent"> Games</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg leading-8 text-blue-100 mb-8">
                                Browse, play, and share incredible games created by developers around the world. Join our vibrant gaming community today.
                            </p>

                            <div className="flex items-center justify-center gap-x-6 mb-16">
                                <Link
                                    href={route('games.browse')}
                                    className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                                >
                                    Browse All Games
                                </Link>
                                {!auth.user && (
                                    <Link
                                        href={route('register')}
                                        className="text-base font-semibold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400"
                                    >
                                        Join the Community <span aria-hidden="true">→</span>
                                    </Link>
                                )}
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stats?.totalGames?.toLocaleString() || '0'}
                                    </div>
                                    <div className="text-sm font-medium text-blue-200">
                                        Games Available
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stats?.totalUsers?.toLocaleString() || '0'}
                                    </div>
                                    <div className="text-sm font-medium text-blue-200">
                                        Active Users
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">
                                        {stats?.totalDownloads >= 1000000
                                            ? `${(stats.totalDownloads / 1000000).toFixed(1)}M`
                                            : stats?.totalDownloads >= 1000
                                                ? `${(stats.totalDownloads / 1000).toFixed(1)}K`
                                                : stats?.totalDownloads?.toLocaleString() || '0'}
                                    </div>
                                    <div className="text-sm font-medium text-blue-200">
                                        Total Downloads
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Games */}
                    {featuredGames && featuredGames.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight text-white">
                                    Featured Games
                                </h2>
                                <Link
                                    href={route('games.browse')}
                                    className="text-sm font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                                >
                                    View all games →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                                {featuredGames.slice(0, 3).map((game, index) => (
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
                                        <p className="text-sm text-blue-200 mb-2 line-clamp-2">{game.description}</p>
                                        <div className="flex items-center justify-between text-xs text-blue-300">
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

                    {/* Popular Games Section */}
                    <div className="mt-16 sm:mt-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                Popular Games
                            </h2>
                            <Link
                                href={route('games.browse')}
                                className="inline-flex items-center text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 text-sm font-medium"
                            >
                                View all games →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Popular Games Grid */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {popular && popular.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {popular.map((game: Game, index: number) => (
                                <Link
                                    key={game.id}
                                    href={route('games.show', game.id)}
                                    className="group cursor-pointer rounded-xl backdrop-blur-sm bg-white/5 p-6 shadow-xl ring-1 ring-white/10 transition-all hover:shadow-2xl hover:ring-2 hover:ring-orange-300/50 hover:bg-white/10 border border-white/10"
                                >
                                    <div className={`mb-4 h-40 rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} relative overflow-hidden`}>
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
                                        {game.is_featured && (
                                            <div className="absolute top-3 right-3">
                                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{game.title}</h3>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${categoryColors[game.category as keyof typeof categoryColors] || categoryColors.other}`}>
                                                {game.category.charAt(0).toUpperCase() + game.category.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{game.description}</p>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                                            <Link
                                                href={`/users/${game.user_id}`}
                                                className="text-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {game.user?.name || 'Anonymous'}
                                            </Link>
                                            <div className="flex items-center space-x-1 text-sm text-slate-500 dark:text-slate-400">
                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>{game.downloads_count >= 1000 ? `${Math.round(game.downloads_count / 100) / 10}k` : game.downloads_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.718 2.172" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No games available yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Be the first developer to share your creation with the community!
                            </p>
                            {auth.user && (
                                <Link
                                    href={route('games.create')}
                                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-pink-700"
                                >
                                    Upload Your First Game
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Features Section */}
                <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8 relative">
                    <div className="mx-auto max-w-2xl text-center mb-16 relative">
                        <div className="absolute inset-0 bg-white/5 rounded-2xl blur-2xl"></div>
                        <div className="relative backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/10">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Why Choose GameHub?
                            </h2>
                            <p className="mt-4 text-lg leading-8 text-blue-100">
                                Everything you need to discover, play, and share amazing games in one place.
                            </p>
                        </div>
                    </div>                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col items-center text-center">
                                <dt className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 flex items-center justify-center mb-4">
                                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
                                        </svg>
                                    </div>
                                    <div className="text-xl font-semibold leading-7 text-white">
                                        Instant Play
                                    </div>
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                                    <p className="flex-auto text-center">Jump into games instantly with no downloads required. Play directly in your browser with just one click.</p>
                                </dd>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <dt className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" />
                                        </svg>
                                    </div>
                                    <div className="text-xl font-semibold leading-7 text-white">
                                        Share & Upload
                                    </div>
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                                    <p className="flex-auto text-center">Upload your own games and share them with players worldwide. Get feedback and build your developer portfolio.</p>
                                </dd>
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <dt className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mb-4">
                                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h2v2h2v2H4zM13 13c0 1.11-.89 2-2 2s-2-.89-2-2 .89-2 2-2 2 .89 2 2zM8 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2S8 5.11 8 4z" />
                                        </svg>
                                    </div>
                                    <div className="text-xl font-semibold leading-7 text-white">
                                        Community Driven
                                    </div>
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-blue-100">
                                    <p className="flex-auto text-center">Join a vibrant community of gamers and developers. Rate, review, and discover your next favorite game.</p>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Platform Statistics */}
                    <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:max-w-none">
                        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-16 sm:px-16">
                            <div className="mx-auto max-w-4xl text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                    Join Thousands of Gamers Worldwide
                                </h2>
                                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-orange-100">
                                    GameHub is growing every day with new games, developers, and players joining our community.
                                </p>
                                <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 gap-8 sm:max-w-xl sm:grid-cols-3">
                                    <div className="flex flex-col gap-y-3 border-l border-white/20 pl-6 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-6">
                                        <div className="text-3xl font-semibold leading-6 text-white">
                                            {stats?.totalGames?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm leading-5 text-orange-100">Games Available</div>
                                    </div>
                                    <div className="flex flex-col gap-y-3 border-l border-white/20 pl-6 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-6">
                                        <div className="text-3xl font-semibold leading-6 text-white">
                                            {stats?.totalUsers?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm leading-5 text-orange-100">Active Users</div>
                                    </div>
                                    <div className="flex flex-col gap-y-3 border-l border-white/20 pl-6 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-6">
                                        <div className="text-3xl font-semibold leading-6 text-white">
                                            {stats?.totalDownloads >= 1000000
                                                ? `${(stats.totalDownloads / 1000000).toFixed(1)}M`
                                                : stats?.totalDownloads >= 1000
                                                    ? `${(stats.totalDownloads / 1000).toFixed(1)}K`
                                                    : stats?.totalDownloads?.toLocaleString() || '0'}
                                        </div>
                                        <div className="text-sm leading-5 text-orange-100">Total Downloads</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="relative z-10 mx-auto mt-24 max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to start your gaming journey?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
                            Join thousands of gamers and developers who are already part of the GameHub community.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {!auth.user ? (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                                    >
                                        Join GameHub Today
                                    </Link>
                                    <Link
                                        href={route('games.browse')}
                                        className="text-base font-semibold text-white hover:text-orange-400"
                                    >
                                        Browse Games <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('games.create')}
                                        className="rounded-lg bg-gradient-to-r from-orange-500 to-pink-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition-all hover:from-orange-600 hover:to-pink-700 hover:shadow-lg"
                                    >
                                        Upload Your Game
                                    </Link>
                                    <Link
                                        href={route('profile')}
                                        className="text-base font-semibold text-white hover:text-orange-400"
                                    >
                                        View Profile <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mx-auto mt-24 max-w-7xl px-6 pb-8 lg:px-8 relative z-10">
                    <div className="border-t border-white/20 pt-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.859 0-7 3.141-7 7v1h1 1 14z" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">GameHub</span>
                            </div>
                            <p className="text-sm text-blue-200">
                                &copy; 2025 GameHub. All rights reserved. Made with ❤️ for gamers worldwide.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
