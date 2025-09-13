import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, Gamepad2, FileText, Clock } from 'lucide-react';

interface User {
    id: number;
    name: string;
    profile_picture?: string;
}

interface Game {
    id: number;
    title: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    commentable: {
        id: number;
        title: string;
        user: User;
        game?: Game;
    } & ({
        type: 'App\\Models\\Discussion';
    } | {
        type: 'App\\Models\\Update';
    });
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    created_at: string;
    game: Game;
    comments: any[];
}

interface Update {
    id: number;
    title: string;
    content: string;
    created_at: string;
    game: Game;
    comments: any[];
}

interface RecentGame {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    downloads_count: number;
    created_at: string;
}

interface Props {
    profileUser: User;
    recentComments: Comment[];
    recentDiscussions: Discussion[];
    recentGames: RecentGame[];
    recentUpdates: Update[];
}

export default function UserActivity({
    profileUser,
    recentComments,
    recentDiscussions,
    recentGames,
    recentUpdates
}: Props) {
    const { auth } = usePage().props as any;
    const isOwnProfile = auth.user?.id === profileUser.id;

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <AppLayout>
            <Head title={`${profileUser.name}'s Activity`} />

            <div className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={profileUser.profile_picture} alt={profileUser.name} />
                        <AvatarFallback>
                            {profileUser.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {profileUser.name}'s Recent Activity
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {isOwnProfile ? 'Your recent activity' : `Recent activity from ${profileUser.name}`}
                        </p>
                    </div>
                    <div className="flex-1"></div>
                    <Button asChild variant="outline">
                        <Link href={`/users/${profileUser.id}`}>
                            Back to Profile
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Comments */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Recent Comments
                        </h2>

                        {recentComments.length > 0 ? (
                            <div className="space-y-4">
                                {recentComments.map((comment) => (
                                    <Card key={comment.id} className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {formatTimeAgo(comment.created_at)}
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {comment.commentable.type === 'App\\Models\\Discussion' ? 'Discussion' : 'Update'}
                                                </Badge>
                                            </div>

                                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                                                {truncateContent(comment.content)}
                                            </p>

                                            <div className="text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Commented on: </span>
                                                <Link
                                                    href={comment.commentable.type === 'App\\Models\\Discussion'
                                                        ? `/forum/${comment.commentable.id}`
                                                        : `/updates/${comment.commentable.id}`
                                                    }
                                                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                                >
                                                    {comment.commentable.title}
                                                </Link>
                                                {comment.commentable.game && (
                                                    <>
                                                        <span className="text-gray-500 dark:text-gray-400"> in </span>
                                                        <Link
                                                            href={`/games/${comment.commentable.game.id}`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            {comment.commentable.game.title}
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-gray-500 dark:text-gray-400">No recent comments</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Recent Discussions & Updates */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Recent Posts
                        </h2>

                        <div className="space-y-4">
                            {/* Recent Discussions */}
                            {recentDiscussions.map((discussion) => (
                                <Card key={`discussion-${discussion.id}`} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatTimeAgo(discussion.created_at)}
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                Discussion
                                            </Badge>
                                        </div>

                                        <h3 className="font-semibold mb-2">
                                            <Link
                                                href={route('users.forum.show', [profileUser.id, discussion.id])}
                                                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                {discussion.title}
                                            </Link>
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                            {truncateContent(discussion.content)}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <Link
                                                href={`/games/${discussion.game.id}`}
                                                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                <Gamepad2 className="h-3 w-3 mr-1" />
                                                {discussion.game.title}
                                            </Link>
                                            {discussion.comments && discussion.comments.length > 0 && (
                                                <span className="flex items-center">
                                                    <MessageSquare className="h-3 w-3 mr-1" />
                                                    {discussion.comments.length} replies
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Recent Updates */}
                            {recentUpdates.map((update) => (
                                <Card key={`update-${update.id}`} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {formatTimeAgo(update.created_at)}
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Update
                                            </Badge>
                                        </div>

                                        <h3 className="font-semibold mb-2">
                                            <Link
                                                href={route('users.updates.show', [profileUser.id, update.id])}
                                                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                {update.title}
                                            </Link>
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                                            {truncateContent(update.content)}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                            <Link
                                                href={`/games/${update.game.id}`}
                                                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                <Gamepad2 className="h-3 w-3 mr-1" />
                                                {update.game.title}
                                            </Link>
                                            {update.comments && update.comments.length > 0 && (
                                                <span className="flex items-center">
                                                    <MessageSquare className="h-3 w-3 mr-1" />
                                                    {update.comments.length} comments
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {recentDiscussions.length === 0 && recentUpdates.length === 0 && (
                                <Card>
                                    <CardContent className="p-8 text-center">
                                        <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400">No recent posts</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Games */}
                {recentGames.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <Gamepad2 className="h-5 w-5 mr-2" />
                            Recently Published Games
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentGames.map((game) => (
                                <Card key={game.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-0">
                                        {game.thumbnail ? (
                                            <img
                                                src={game.thumbnail}
                                                alt={game.title}
                                                className="w-full h-32 object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
                                                <Gamepad2 className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg mb-2">
                                            <Link
                                                href={`/games/${game.id}`}
                                                className="hover:text-blue-600 dark:hover:text-blue-400"
                                            >
                                                {game.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 mb-3">
                                            {game.description}
                                        </CardDescription>

                                        <div className="flex items-center justify-between text-sm">
                                            <Badge variant="secondary">
                                                {game.downloads_count} downloads
                                            </Badge>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {formatTimeAgo(game.created_at)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
