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

interface Props extends SharedData {
    updates: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Updates',
        href: '/updates',
    },
];

export default function UpdatesIndex() {
    const { updates = [] } = usePage<Props>().props;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="My Updates" />

            <div className="max-w-7xl mx-auto p-6">
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
                {updates.length === 0 ? (
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
                        {/* Sample update posts - replace with actual data */}
                        {[1, 2, 3].map((update) => (
                            <div key={update} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                                        U
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-medium text-slate-900 dark:text-white">You</span>
                                            <span className="text-xs text-slate-500">•</span>
                                            <span className="text-xs text-slate-500">2 days ago</span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                Update
                                            </span>
                                            {update === 1 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                                    Important
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                            Space Explorer v2.1 Released!
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                                            We've just released a major update to Space Explorer with new levels,
                                            improved graphics, and bug fixes based on your feedback. Thank you for
                                            your continued support!
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span>24 likes</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span>8 comments</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>156 views</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                    Edit
                                                </button>
                                                <button className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                                    View
                                                </button>
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
