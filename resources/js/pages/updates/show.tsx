import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, User, Tag, AlertCircle, Pin, Eye, Edit, Trash2, ArrowLeft } from 'lucide-react';
import AppSidebarLayout from '@/layouts/app/app-header-layout';
import CommentSection from '@/components/comment-section';
import { Update, Game, User as UserType, SharedData } from '@/types';
import { router } from '@inertiajs/react';

interface Props extends SharedData {
    update: Update & {
        user: UserType;
        game?: Game;
    };
    relatedUpdates: Update[];
}

export default function ShowUpdate({ update, relatedUpdates }: Props) {
    const { auth } = usePage<Props>().props;
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'update':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'patch':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'hotfix':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'announcement':
                return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'news':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
            setIsDeleting(true);
            router.delete(`/updates/${update.id}`, {
                onFinish: () => setIsDeleting(false)
            });
        }
    };

    const isOwner = update.user_id === (window as any).Laravel?.user?.id;

    return (
        <AppSidebarLayout>
            <Head title={update.title} />

            <div className="w-full px-6 py-6">
                {/* Back button */}
                <Link
                    href="/updates"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Updates
                </Link>

                {/* Main Content */}
                <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-slate-600">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    {update.is_pinned && (
                                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                            <Pin className="w-3 h-3" />
                                            Pinned
                                        </div>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(update.type)}`}>
                                        {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(update.importance)}`}>
                                        <AlertCircle className="w-3 h-3 inline mr-1" />
                                        {update.importance.charAt(0).toUpperCase() + update.importance.slice(1)}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                                    {update.title}
                                </h1>

                                <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <Link
                                            href={`/users/${update.user.id}`}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {update.user.name}
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(update.published_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>{update.views_count || 0} views</span>
                                    </div>
                                    {update.game && (
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4" />
                                            <Link
                                                href={`/games/${update.game.id}`}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                {update.game.title}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            {isOwner && (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/updates/${update.id}/edit`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: update.content.replace(/\n/g, '<br>') }}
                        />
                    </div>
                </article>

                {/* Related Updates */}
                {relatedUpdates.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Updates</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedUpdates.map((relatedUpdate) => (
                                <Link
                                    key={relatedUpdate.id}
                                    href={`/updates/${relatedUpdate.id}`}
                                    className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(relatedUpdate.type)}`}>
                                            {relatedUpdate.type}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(relatedUpdate.importance)}`}>
                                            {relatedUpdate.importance}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                        {relatedUpdate.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {formatDate(relatedUpdate.published_at)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 p-6">
                    <CommentSection
                        commentableType="App\Models\Update"
                        commentableId={update.id}
                        currentUserId={auth?.user?.id}
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
}
