import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gamepad2, MessageSquare, Trophy, Users } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
    bio?: string;
    location?: string;
    website?: string;
    created_at: string;
    games?: Game[];
}

interface Game {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    downloads_count: number;
    created_at: string;
}

interface Stats {
    totalGames: number;
    totalDiscussions: number;
    totalComments: number;
    joinedAt: string;
}

interface Props {
    profileUser: User;
    stats: Stats;
}

export default function UserShow({ profileUser, stats }: Props) {
    const { auth } = usePage().props as any;
    const isOwnProfile = auth.user?.id === profileUser.id;

    return (
        <AppLayout>
            <Head title={`${profileUser.name} - Profile`} />

            <div className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16">
                            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
                                <AvatarImage
                                    src={profileUser.profile_picture}
                                    alt={profileUser.name}
                                />
                                <AvatarFallback className="text-3xl">
                                    {profileUser.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {profileUser.name}
                                        </h1>
                                        {profileUser.bio && (
                                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                                {profileUser.bio}
                                            </p>
                                        )}
                                        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Joined {stats.joinedAt}
                                        </div>
                                        {profileUser.location && (
                                            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <Users className="w-4 h-4 mr-1" />
                                                {profileUser.location}
                                            </div>
                                        )}
                                    </div>

                                    {isOwnProfile && (
                                        <Button asChild className="mt-4 sm:mt-0">
                                            <Link href="/settings">
                                                Edit Profile
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Gamepad2 className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Games</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGames}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <MessageSquare className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Discussions</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDiscussions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Trophy className="h-8 w-8 text-yellow-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {profileUser.games?.reduce((sum, game) => sum + game.downloads_count, 0) || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation & Content */}
                <div className="mt-8">
                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Button asChild variant="outline" size="lg" className="h-auto p-6">
                            <Link href={`/users/${profileUser.id}/games`} className="flex flex-col items-center space-y-2">
                                <Gamepad2 className="h-8 w-8" />
                                <div className="text-center">
                                    <div className="font-semibold">View All Games</div>
                                    <div className="text-sm text-gray-500">{stats.totalGames} published</div>
                                </div>
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="h-auto p-6">
                            <Link href={`/users/${profileUser.id}/forum`} className="flex flex-col items-center space-y-2">
                                <MessageSquare className="h-8 w-8" />
                                <div className="text-center">
                                    <div className="font-semibold">Forum</div>
                                    <div className="text-sm text-gray-500">{stats.totalDiscussions} discussions</div>
                                </div>
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="h-auto p-6">
                            <Link href={`/users/${profileUser.id}/updates`} className="flex flex-col items-center space-y-2">
                                <Calendar className="h-8 w-8" />
                                <div className="text-center">
                                    <div className="font-semibold">Updates</div>
                                    <div className="text-sm text-gray-500">Latest news</div>
                                </div>
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="h-auto p-6">
                            <Link href={`/users/${profileUser.id}/activity`} className="flex flex-col items-center space-y-2">
                                <Trophy className="h-8 w-8" />
                                <div className="text-center">
                                    <div className="font-semibold">Recent Activity</div>
                                    <div className="text-sm text-gray-500">Comments & more</div>
                                </div>
                            </Link>
                        </Button>
                    </div>

                    {/* Recent Games Preview */}
                    {profileUser.games && profileUser.games.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Games</h2>
                                {stats.totalGames > 6 && (
                                    <Button asChild variant="outline">
                                        <Link href={`/users/${profileUser.id}/games`}>
                                            View All ({stats.totalGames})
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileUser.games.map((game) => (
                                    <Card key={game.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            {game.thumbnail && (
                                                <img
                                                    src={game.thumbnail}
                                                    alt={game.title}
                                                    className="w-full h-48 object-cover rounded-md"
                                                />
                                            )}
                                            <CardTitle className="text-lg">
                                                <Link
                                                    href={`/games/${game.id}`}
                                                    className="hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    {game.title}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription>{game.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <Badge variant="secondary">
                                                    {game.downloads_count} downloads
                                                </Badge>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(game.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {(!profileUser.games || profileUser.games.length === 0) && (
                        <div className="text-center py-12">
                            <Gamepad2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No games</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {isOwnProfile ? 'You haven\'t published any games yet.' : `${profileUser.name} hasn't published any games yet.`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
