import AppSidebarLayout from '@/layouts/app/app-header-layout';
import CommentSection from '@/components/comment-section';
import { type BreadcrumbItem, type SharedData, type Discussion } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Eye,
    Gamepad2,
    Heart,
    MessageSquare,
    Pin,
    Share,
    ThumbsUp,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props extends SharedData {
    discussion: Discussion;
}

export default function DiscussionShow() {
    const { discussion, auth } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Forum',
            href: '/forum',
        },
        {
            title: discussion.title,
            href: `/forum/${discussion.id}`,
        },
    ];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={discussion.title} />

            <div className="max-w-4xl mx-auto p-6">
                {/* Back Navigation */}
                <Link
                    href="/forum"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Forum
                </Link>

                {/* Discussion Header */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
                    <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={discussion.user?.profile_picture ? `/storage/${discussion.user.profile_picture}` : undefined}
                                alt={discussion.user?.name || 'User'}
                            />
                            <AvatarFallback>
                                {discussion.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Link
                                    href={`/users/${discussion.user?.id}`}
                                    className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {discussion.user?.name || 'Unknown User'}
                                </Link>
                                <span className="text-sm text-slate-500">•</span>
                                <span className="text-sm text-slate-500">
                                    {formatDate(discussion.created_at)}
                                </span>
                                {discussion.is_pinned && (
                                    <Pin className="h-4 w-4 text-orange-500" />
                                )}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    {discussion.category}
                                </span>
                                {discussion.game && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 gap-1">
                                        <Gamepad2 className="h-3 w-3" />
                                        {discussion.game.title}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                {discussion.title}
                            </h1>

                            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                                <p className="whitespace-pre-wrap">{discussion.content}</p>
                            </div>
                        </div>
                    </div>

                    {/* Discussion Stats and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{discussion.views_count} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{discussion.replies_count} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{discussion.upvotes || 0} likes</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4 mr-2" />
                                Like
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share className="h-4 w-4 mr-2" />
                                Share
                            </Button>
                            {auth?.user?.id === discussion.user_id && (
                                <Link
                                    href={`/forum/${discussion.id}/edit`}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                >
                                    Edit
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <CommentSection
                        commentableType="App\Models\Discussion"
                        commentableId={discussion.id}
                        currentUserId={auth?.user?.id}
                    />
                </div>
            </div>
        </AppSidebarLayout>
    );
}
