import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gamepad2, Search, Download, Calendar } from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    profile_picture?: string;
}

interface Game {
    id: number;
    title: string;
    description: string;
    thumbnail?: string;
    downloads_count: number;
    created_at: string;
    updated_at: string;
    user: User;
}

interface PaginatedGames {
    data: Game[];
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
    games: PaginatedGames;
    filters: {
        search?: string;
        sort?: string;
    };
}

export default function UserGames({ profileUser, games, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const handleSearch = () => {
        router.get(route('users.games', profileUser.id), {
            search: search || undefined,
            sort: sort !== 'latest' ? sort : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSortChange = (newSort: string) => {
        setSort(newSort);
        router.get(route('users.games', profileUser.id), {
            search: search || undefined,
            sort: newSort !== 'latest' ? newSort : undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`${profileUser.name}'s Games`} />

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
                            {profileUser.name}'s Games
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            {games.total} published games
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
                                placeholder="Search games..."
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
                    <Select value={sort} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Latest</SelectItem>
                            <SelectItem value="oldest">Oldest</SelectItem>
                            <SelectItem value="downloads">Most Downloads</SelectItem>
                            <SelectItem value="title">Title (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Games Grid */}
                {games.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {games.data.map((game) => (
                                <Card key={game.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-0">
                                        {game.thumbnail ? (
                                            <img
                                                src={game.thumbnail}
                                                alt={game.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-lg">
                                                <Gamepad2 className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg mb-2">
                                            <Link
                                                href={`/games/${game.id}`}
                                                className="hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                                            >
                                                {game.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="line-clamp-3 mb-4">
                                            {game.description}
                                        </CardDescription>

                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Download className="h-3 w-3" />
                                                {game.downloads_count}
                                            </Badge>
                                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(game.created_at).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {game.updated_at !== game.created_at && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                Updated {new Date(game.updated_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {games.last_page > 1 && (
                            <div className="flex justify-center">
                                <div className="flex space-x-2">
                                    {games.links.map((link, index) => {
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
                                                        router.get(route('users.games', profileUser.id), {
                                                            search: search || undefined,
                                                            sort: sort !== 'latest' ? sort : undefined,
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
                        <Gamepad2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            No games found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {search ? `No games match "${search}"` : `${profileUser.name} hasn't published any games yet.`}
                        </p>
                        {search && (
                            <Button
                                onClick={() => {
                                    setSearch('');
                                    router.get(route('users.games', profileUser.id), {
                                        sort: sort !== 'latest' ? sort : undefined,
                                    }, {
                                        preserveState: true,
                                        replace: true,
                                    });
                                }}
                                variant="outline"
                                className="mt-4"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
