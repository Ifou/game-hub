import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData, type Game, type Discussion, type Update } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Calendar,
    Hash,
    HelpCircle,
    MessageSquare,
    Pin,
    Plus,
    Search,
    ThumbsUp,
    TrendingUp,
    Users,
    Zap,
    Gamepad2,
    Filter,
    Clock
} from 'lucide-react';
import { useState } from 'react';

interface Props extends SharedData {
    discussions: Discussion[];
    updates: Update[];
    games: Game[];
    filters?: {
        search?: string;
        category?: string;
        game_id?: string;
        type?: 'discussions' | 'updates' | 'all';
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Forum',
        href: '/forum',
    },
];

const categories = [
    { id: 'general', name: 'General Discussion', icon: MessageSquare, count: 234, color: 'blue' },
    { id: 'game-dev', name: 'Game Development', icon: Zap, count: 89, color: 'purple' },
    { id: 'showcase', name: 'Game Showcase', icon: Pin, count: 156, color: 'orange' },
    { id: 'feedback', name: 'Feedback & Reviews', icon: Users, count: 67, color: 'green' },
    { id: 'help', name: 'Help & Support', icon: HelpCircle, count: 43, color: 'red' },
    { id: 'off-topic', name: 'Off-Topic', icon: Hash, count: 78, color: 'gray' },
];

export default function ForumIndex() {
    const { discussions = [], updates = [], games = [], filters = {} } = usePage<Props>().props;
    const [currentView, setCurrentView] = useState<'discussions' | 'updates' | 'all'>(filters.type || 'all');
    const [selectedGame, setSelectedGame] = useState<string>(filters.game_id || '');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;

        router.get('/forum', {
            search,
            game_id: selectedGame,
            type: currentView
        }, { preserveState: true });
    };

    const handleGameFilter = (gameId: string) => {
        setSelectedGame(gameId);
        router.get('/forum', {
            search: searchQuery,
            game_id: gameId,
            type: currentView
        }, { preserveState: true });
    };

    const handleViewChange = (view: 'discussions' | 'updates' | 'all') => {
        setCurrentView(view);
        router.get('/forum', {
            search: searchQuery,
            game_id: selectedGame,
            type: view
        }, { preserveState: true });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Forum" />

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">GameHub Forum</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Connect with the gaming community, share ideas, and get help
                        </p>
                    </div>
                    <Link
                        href="/forum/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Start Discussion
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="h-5 w-5 absolute left-3 top-3 text-slate-400" />
                                <input
                                    name="search"
                                    type="text"
                                    placeholder="Search discussions and updates..."
                                    defaultValue={searchQuery}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                            {/* View Type Filter */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleViewChange('all')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${currentView === 'all'
                                        ? 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <Filter className="h-4 w-4" />
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleViewChange('discussions')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${currentView === 'discussions'
                                        ? 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Discussions
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleViewChange('updates')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1 ${currentView === 'updates'
                                        ? 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                                        : 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    <Clock className="h-4 w-4" />
                                    Updates
                                </button>
                            </div>

                            {/* Game Filter */}
                            <select
                                value={selectedGame}
                                onChange={(e) => handleGameFilter(e.target.value)}
                                className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Games</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id.toString()}>
                                        {game.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Content List */}
                        <div className="space-y-4">
                            {/* Discussions */}
                            {(currentView === 'all' || currentView === 'discussions') && discussions.length > 0 && (
                                <div className="space-y-4">
                                    {currentView === 'all' && (
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <MessageSquare className="h-5 w-5" />
                                            Recent Discussions
                                        </h2>
                                    )}
                                    {discussions.map((discussion) => (
                                        <div key={`discussion-${discussion.id}`} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {discussion.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Link
                                                            href={`/users/${discussion.user?.id}`}
                                                            className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            {discussion.user?.name || 'Unknown User'}
                                                        </Link>
                                                        <span className="text-xs text-slate-500">•</span>
                                                        <span className="text-xs text-slate-500">
                                                            {new Date(discussion.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {discussion.category}
                                                        </span>
                                                        {discussion.game && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 gap-1">
                                                                <Gamepad2 className="h-3 w-3" />
                                                                {discussion.game.title}
                                                            </span>
                                                        )}
                                                        {discussion.is_pinned && (
                                                            <Pin className="h-4 w-4 text-orange-500" />
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                                        <Link href={`/forum/${discussion.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                                            {discussion.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                                                        {discussion.content}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                            <div className="flex items-center gap-1">
                                                                <ThumbsUp className="h-4 w-4" />
                                                                <span>{String(discussion.upvotes || 0)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare className="h-4 w-4" />
                                                                <span>{String(discussion.replies_count || 0)} replies</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>
                                                                {discussion.last_activity_at
                                                                    ? `Last activity ${new Date(discussion.last_activity_at).toLocaleDateString()}`
                                                                    : `Created ${new Date(discussion.created_at).toLocaleDateString()}`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Updates */}
                            {(currentView === 'all' || currentView === 'updates') && updates.length > 0 && (
                                <div className="space-y-4">
                                    {currentView === 'all' && (
                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            Recent Updates
                                        </h2>
                                    )}
                                    {updates.map((update) => (
                                        <div key={`update-${update.id}`} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                                    {update.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Link
                                                            href={`/users/${update.user?.id}`}
                                                            className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                        >
                                                            {update.user?.name || 'Unknown User'}
                                                        </Link>
                                                        <span className="text-xs text-slate-500">•</span>
                                                        <span className="text-xs text-slate-500">
                                                            {new Date(update.created_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                            {update.type || 'Update'}
                                                        </span>
                                                        {update.game && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 gap-1">
                                                                <Gamepad2 className="h-3 w-3" />
                                                                {update.game.title}
                                                            </span>
                                                        )}
                                                        {update.is_pinned && (
                                                            <Pin className="h-4 w-4 text-orange-500" />
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                                        <Link href={`/updates/${update.id}`} className="hover:text-green-600 dark:hover:text-green-400">
                                                            {update.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                                                        {update.content}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                            <div className="flex items-center gap-1">
                                                                <ThumbsUp className="h-4 w-4" />
                                                                <span>{String(update.likes_count || 0)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare className="h-4 w-4" />
                                                                <span>{String(update.comments_count || 0)} comments</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>
                                                                {update.published_at
                                                                    ? `Published ${new Date(update.published_at).toLocaleDateString()}`
                                                                    : `Created ${new Date(update.created_at).toLocaleDateString()}`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {((currentView === 'discussions' && discussions.length === 0) ||
                                (currentView === 'updates' && updates.length === 0) ||
                                (currentView === 'all' && discussions.length === 0 && updates.length === 0)) && (
                                    <div className="text-center py-16">
                                        <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                            {currentView === 'discussions' ? 'No discussions found' :
                                                currentView === 'updates' ? 'No updates found' :
                                                    'No content found'}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                                            {currentView === 'discussions' ? 'Start a new discussion to get the conversation going!' :
                                                currentView === 'updates' ? 'Check back later for game updates from the community!' :
                                                    'Try adjusting your filters or search terms.'}
                                        </p>
                                        {currentView === 'discussions' && (
                                            <Link
                                                href="/forum/create"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Start Discussion
                                            </Link>
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Categories */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/forum?category=${category.id}`}
                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <category.icon className="h-4 w-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                                            <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                                                {category.name}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                                            {category.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Online Users */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Community Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Online Users</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">47</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Total Members</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">2,431</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-300">Total Discussions</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">667</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
