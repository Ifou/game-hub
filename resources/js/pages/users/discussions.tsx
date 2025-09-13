import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Search, Calendar, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    profile_picture?: string;
}

interface Game {
    id: number;
    title: string;
}

interface Discussion {
    id: number;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user: User;
    game: Game;
    comments: any[];
}

interface PaginatedDiscussions {
    data: Discussion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    profileUser: User;
    discussions: PaginatedDiscussions;
    userGames: Game[];
    filters: {
        search?: string;
        game?: string;
    };
}

export default function UserDiscussions({ profileUser, discussions, userGames, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [gameFilter, setGameFilter] = useState(filters.game || '');

    const handleSearch = () => {
        router.get(route('users.discussions', profileUser.id), {
            search: search || undefined,
            game: gameFilter || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleGameFilterChange = (newGame: string) => {
        setGameFilter(newGame);
        router.get(route('users.discussions', profileUser.id), {
            search: search || undefined,
            game: newGame || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const truncateContent = (content: string, maxLength: number = 200) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <AppLayout>
            <Head title={`${profileUser.name}'s Forum Discussions`} />

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
                            {profileUser.name}'s Forum Discussions
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {discussions.total} forum posts
                        </p>
                    </div>
                    <div className="flex-1"></div>
                    <Button asChild variant="outline">
                        <Link href={`/users/${profileUser.id}`}>
                            Back to Profile
                        </Link>
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search discussions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSearch} variant="outline">
                        Search
                    </Button>
                    <Select value={gameFilter} onValueChange={handleGameFilterChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by game..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All games</SelectItem>
                            {userGames.map((game) => (
                                <SelectItem key={game.id} value={game.id.toString()}>
                                    {game.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Discussions List */}
                {discussions.data.length > 0 ? (
                    <>
                        <div className="space-y-4 mb-8">
                            {discussions.data.map((discussion) => (
                                <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">
                                                    <Link
                                                        href={route('users.forum.show', [profileUser.id, discussion.id])}
                                                        className="hover:text-blue-600 dark:hover:text-blue-400"
                                                    >
                                                        {discussion.title}
                                                    </Link>
                                                </CardTitle>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Gamepad2 className="h-4 w-4" />
                                                        <Link
                                                            href={`/games/${discussion.game.id}`}
                                                            className="hover:text-blue-600 dark:hover:text-blue-400"
                                                        >
                                                            {discussion.game.title}
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(discussion.created_at).toLocaleDateString()}
                                                    </div>
                                                    {discussion.comments && discussion.comments.length > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <MessageSquare className="h-4 w-4" />
                                                            {discussion.comments.length} replies
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <CardDescription className="text-base">
                                            {truncateContent(discussion.content)}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {discussions.last_page > 1 && (
                            <div className="flex justify-center">
                                <div className="flex space-x-2">
                                    {discussions.links.map((link, index) => {
                                        if (!link.url) {
                                            return (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    disabled
                                                    className="w-10 h-10"
                                                >
                                                    {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                className="w-10 h-10"
                                                onClick={() => {
                                                    if (link.url) {
                                                        const url = new URL(link.url);
                                                        const page = url.searchParams.get('page');
                                                        router.get(route('users.discussions', profileUser.id), {
                                                            search: search || undefined,
                                                            game: gameFilter || undefined,
                                                            page: page || undefined,
                                                        }, {
                                                            preserveState: true,
                                                            replace: true,
                                                        });
                                                    }
                                                }}
                                            >
                                                {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            No discussions found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {search || gameFilter ?
                                `No discussions match your filters` :
                                `${profileUser.name} hasn't started any forum discussions yet.`
                            }
                        </p>
                        {(search || gameFilter) && (
                            <Button
                                onClick={() => {
                                    setSearch('');
                                    setGameFilter('');
                                    router.get(route('users.discussions', profileUser.id), {}, {
                                        preserveState: true,
                                        replace: true,
                                    });
                                }}
                                variant="outline"
                                className="mt-4"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
