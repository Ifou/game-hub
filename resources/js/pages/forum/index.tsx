import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
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
    Zap
} from 'lucide-react';

interface Props extends SharedData {
    discussions: any[];
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
    const { discussions = [] } = usePage<Props>().props;

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
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search discussions..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                Trending
                            </button>
                            <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Recent
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Discussions List */}
                        <div className="space-y-4">
                            {discussions.length === 0 ? (
                                <>
                                    {/* Sample discussions */}
                                    {[1, 2, 3, 4, 5].map((discussion) => (
                                        <div key={discussion} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {discussion === 1 ? 'A' : discussion === 2 ? 'S' : discussion === 3 ? 'M' : discussion === 4 ? 'J' : 'L'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-medium text-slate-900 dark:text-white">
                                                            {discussion === 1 ? 'Alex Smith' : discussion === 2 ? 'Sarah Chen' : discussion === 3 ? 'Mike Johnson' : discussion === 4 ? 'Jane Doe' : 'Lisa Park'}
                                                        </span>
                                                        <span className="text-xs text-slate-500">•</span>
                                                        <span className="text-xs text-slate-500">{discussion} day{discussion !== 1 ? 's' : ''} ago</span>
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                            {discussion === 1 ? 'General Discussion' : discussion === 2 ? 'Game Development' : discussion === 3 ? 'Game Showcase' : discussion === 4 ? 'Help & Support' : 'Feedback & Reviews'}
                                                        </span>
                                                        {discussion === 1 && (
                                                            <Pin className="h-4 w-4 text-orange-500" />
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                                        {discussion === 1 && 'Best Indie Games of 2025 - What are your favorites?'}
                                                        {discussion === 2 && 'Looking for feedback on my puzzle game prototype'}
                                                        {discussion === 3 && 'Just released my first 2D platformer!'}
                                                        {discussion === 4 && 'How do I optimize game performance for mobile?'}
                                                        {discussion === 5 && 'Review: Space Explorer - A masterpiece of indie gaming'}
                                                    </h3>
                                                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 line-clamp-2">
                                                        {discussion === 1 && 'What indie games have impressed you the most this year? Looking for recommendations for games with unique mechanics and great storytelling...'}
                                                        {discussion === 2 && 'I\'ve been working on a puzzle game for the past few months and would love to get some feedback from fellow developers...'}
                                                        {discussion === 3 && 'After 8 months of development, I\'m excited to share my first 2D platformer with the community! It features...'}
                                                        {discussion === 4 && 'I\'m developing a mobile game and struggling with performance issues. The game runs fine on desktop but lags on mobile devices...'}
                                                        {discussion === 5 && 'I just finished playing Space Explorer and I have to say, this is one of the best indie games I\'ve played in years...'}
                                                    </p>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                            <div className="flex items-center gap-1">
                                                                <ThumbsUp className="h-4 w-4" />
                                                                <span>{Math.floor(Math.random() * 50) + 5}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare className="h-4 w-4" />
                                                                <span>{Math.floor(Math.random() * 30) + 2} replies</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>Last reply {Math.floor(Math.random() * 12) + 1}h ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-16">
                                    <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                        No discussions found
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                                        Be the first to start a conversation!
                                    </p>
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
