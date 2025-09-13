import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    FileText,
    MessageSquare,
    Plus,
    Search,
    ThumbsUp,
    Users
} from 'lucide-react';

interface Update {
    id: number;
    title: string;
    content: string;
    type: string;
    importance: string;
    is_pinned: boolean;
    views_count: number;
    likes_count: number;
    comments_count: number;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    game?: {
        id: number;
        title: string;
    };
}

interface Props extends SharedData {
    updates: {
        data: Update[];
        links: any[];
        meta: any;
    };
    types: string[];
    importancelevels: string[];
    filters: {
        type?: string;
        importance?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Updates',
        href: '/updates',
    },
];

export default function UpdatesIndex() {
    const { updates, auth } = usePage<Props>().props;

    // Handle both empty array and paginated data structure
    const updatesData = Array.isArray(updates) ? updates : updates?.data || [];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;

        return date.toLocaleDateString();
    };

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'update': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'patch': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'hotfix': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'announcement': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'news': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
        }
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="My Updates" />

            <div className="w-full px-6 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Updates</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Manage your announcements and news posts
                        </p>
                    </div>
                    <Link
                        href="/updates/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Create Update
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search your updates..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Updates List */}
                {updatesData.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            No updates posted yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            Share news, announcements, and updates with your followers
                        </p>
                        <Link
                            href="/updates/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Create Your First Update
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {updatesData.map((update) => (
                            <div key={update.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                                        {update.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {update.user.name}
                                            </span>
                                            <span className="text-xs text-slate-500">•</span>
                                            <span className="text-xs text-slate-500">
                                                {formatDate(update.created_at)}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(update.type)}`}>
                                                {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                                            </span>
                                            {update.importance !== 'low' && (
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(update.importance)}`}>
                                                    {update.importance.charAt(0).toUpperCase() + update.importance.slice(1)}
                                                </span>
                                            )}
                                            {update.is_pinned && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                                    Pinned
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                            <Link
                                                href={`/updates/${update.id}`}
                                                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {update.title}
                                            </Link>
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                                            {update.content}
                                        </p>
                                        {update.game && (
                                            <div className="mb-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                                    Related to: {update.game.title}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span>{update.likes_count || 0} likes</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span>{update.comments_count || 0} comments</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{update.views_count || 0} views</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/updates/${update.id}/edit`}
                                                    className="px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/updates/${update.id}`}
                                                    className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
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
