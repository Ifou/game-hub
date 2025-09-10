import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    Gamepad2,
    Plus,
    Search,
    Star,
    Users
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface Props extends SharedData {
    games: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Games',
        href: '/games',
    },
];

export default function GamesIndex() {
    const { games = [] } = usePage<Props>().props;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="My Games" />

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Games</h1>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Manage and track your uploaded games
                        </p>
                    </div>
                    <Link
                        href="/games/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Upload Game
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search your games..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Games Grid */}
                {games.length === 0 ? (
                    <div className="text-center py-16">
                        <Gamepad2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            No games uploaded yet
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            Start by uploading your first game to share with the community
                        </p>
                        <Link
                            href="/games/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Upload Your First Game
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Sample game cards - replace with actual data */}
                        {[1, 2, 3].map((game) => (
                            <div key={game} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 bg-gradient-to-br from-emerald-600 to-cyan-600 relative">
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="absolute top-3 right-3">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-700">
                                            Adventure
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                        Space Explorer {game}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        An epic space adventure with stunning visuals and engaging gameplay.
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>1.2k plays</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span>4.8</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            <span>2 days ago</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                            Edit
                                        </button>
                                        <button className="flex-1 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 rounded-md hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                                            View
                                        </button>
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
