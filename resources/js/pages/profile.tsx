import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type User, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    FileText,
    Gamepad2,
    MessageSquare,
    Plus,
    Settings,
    Trophy,
    Upload,
    Users
} from 'lucide-react';

interface Props extends SharedData {
    user: User;
    gamesCount: number;
    forumPostsCount: number;
    updatesCount: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Profile',
        href: '/profile',
    },
];

export default function Profile() {
    const { user, gamesCount = 0, forumPostsCount = 0, updatesCount = 0 } = usePage<Props>().props;

    const stats = [
        { icon: Gamepad2, label: 'Games', value: gamesCount, color: 'text-orange-600' },
        { icon: MessageSquare, label: 'Forum Posts', value: forumPostsCount, color: 'text-blue-600' },
        { icon: FileText, label: 'Updates', value: updatesCount, color: 'text-green-600' },
        { icon: Trophy, label: 'Achievements', value: '5', color: 'text-yellow-600' },
    ];

    const quickActions = [
        {
            icon: Upload,
            title: 'Upload New Game',
            description: 'Share your latest creation',
            href: '/games/create',
            color: 'from-orange-500 to-pink-600',
        },
        {
            icon: FileText,
            title: 'Post Update',
            description: 'Share news about your games',
            href: '/updates/create',
            color: 'from-green-500 to-teal-600',
        },
        {
            icon: MessageSquare,
            title: 'Start Discussion',
            description: 'Create a forum topic',
            href: '/forum/create',
            color: 'from-blue-500 to-purple-600',
        },
        {
            icon: Settings,
            title: 'Profile Settings',
            description: 'Manage your account',
            href: '/settings',
            color: 'from-gray-500 to-slate-600',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name}'s Profile`} />

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600"></div>
                    <div className="p-6 -mt-16">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                            <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                                <p className="text-slate-600 dark:text-slate-300">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                </div>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group block p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-orange-300 dark:hover:border-orange-500 transition-all hover:shadow-lg"
                            >
                                <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <action.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{action.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Games */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Games</h3>
                            <Link href="/games" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                View All
                            </Link>
                        </div>
                        {gamesCount > 0 ? (
                            <div className="space-y-3">
                                {/* Placeholder for games - replace with actual data */}
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                                        <Gamepad2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 dark:text-white">Space Explorer</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Updated 2 days ago</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Gamepad2 className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 dark:text-slate-300">No games uploaded yet</p>
                                <Link
                                    href="/games/create"
                                    className="inline-flex items-center gap-2 mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                                >
                                    <Plus className="h-4 w-4" />
                                    Upload your first game
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Forum Activity */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Forum Activity</h3>
                            <Link href="/forum" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                View All
                            </Link>
                        </div>
                        {forumPostsCount > 0 ? (
                            <div className="space-y-3">
                                {/* Placeholder for forum posts - replace with actual data */}
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <MessageSquare className="h-5 w-5 text-blue-600 mt-1" />
                                    <div className="flex-1">
                                        <p className="font-medium text-slate-900 dark:text-white">Best Indie Games of 2025</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Started 1 week ago • 12 replies</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                                <p className="text-slate-600 dark:text-slate-300">No forum activity yet</p>
                                <Link
                                    href="/forum/create"
                                    className="inline-flex items-center gap-2 mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
                                >
                                    <Plus className="h-4 w-4" />
                                    Start a discussion
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
