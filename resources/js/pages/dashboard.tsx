import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type Game, type Update, type Discussion } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Gamepad2,
    FileText,
    MessageSquare,
    Download,
    Eye,
    TrendingUp,
    Users,
    Upload,
    Plus,
    Calendar,
    Star,
    Activity
} from 'lucide-react';

interface DashboardProps {
    stats: {
        totalGames: number;
        totalUpdates: number;
        totalDiscussions: number;
        totalReplies: number;
        totalDownloads: number;
        totalViews: number;
    };
    platformStats: {
        totalUsers: number;
        totalGamesOnPlatform: number;
        totalUpdatesOnPlatform: number;
        totalDiscussionsOnPlatform: number;
    };
    recentGames: Game[];
    recentUpdates: Update[];
    recentDiscussions: Discussion[];
    popularGames: Game[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats,
    platformStats,
    recentGames,
    recentUpdates,
    recentDiscussions,
    popularGames
}: DashboardProps) {
    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                        <p className="text-muted-foreground">Here's an overview of your portfolio activity.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/games/create">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Game
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Games</CardTitle>
                            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalGames}</div>
                            <p className="text-xs text-muted-foreground">Published games</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                            <Download className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(stats.totalDownloads)}</div>
                            <p className="text-xs text-muted-foreground">Across all games</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Updates & Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUpdates + stats.totalDiscussions}</div>
                            <p className="text-xs text-muted-foreground">{stats.totalUpdates} updates, {stats.totalDiscussions} discussions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatNumber(stats.totalViews)}</div>
                            <p className="text-xs text-muted-foreground">Combined content views</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Popular Games */}
                    {popularGames.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Most Popular Games
                                        </CardTitle>
                                        <CardDescription>Your games with the most downloads</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/games">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {popularGames.map((game, index) => (
                                        <div key={game.id} className="flex items-center space-x-4">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/games/${game.id}`}
                                                    className="font-medium hover:underline truncate block"
                                                >
                                                    {game.title}
                                                </Link>
                                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Download className="h-3 w-3" />
                                                        {formatNumber(game.downloads_count || 0)}
                                                    </span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {game.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Platform Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Platform Overview
                            </CardTitle>
                            <CardDescription>Community statistics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        Total Users
                                    </span>
                                    <span className="font-bold">{formatNumber(platformStats.totalUsers)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                                        Total Games
                                    </span>
                                    <span className="font-bold">{formatNumber(platformStats.totalGamesOnPlatform)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        Total Updates
                                    </span>
                                    <span className="font-bold">{formatNumber(platformStats.totalUpdatesOnPlatform)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        Total Discussions
                                    </span>
                                    <span className="font-bold">{formatNumber(platformStats.totalDiscussionsOnPlatform)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Games */}
                    {recentGames.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Recent Games</CardTitle>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/games">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentGames.map((game) => (
                                        <div key={game.id} className="flex items-start space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                                                <Gamepad2 className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/games/${game.id}`}
                                                    className="font-medium hover:underline text-sm truncate block"
                                                >
                                                    {game.title}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(game.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Updates */}
                    {recentUpdates.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Recent Updates</CardTitle>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/updates">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentUpdates.map((update) => (
                                        <div key={update.id} className="flex items-start space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 dark:bg-blue-900">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/updates/${update.id}`}
                                                    className="font-medium hover:underline text-sm truncate block"
                                                >
                                                    {update.title}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">
                                                    {update.game?.title && (
                                                        <span>{update.game.title} • </span>
                                                    )}
                                                    {new Date(update.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Discussions */}
                    {recentDiscussions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Recent Discussions</CardTitle>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/forum">View All</Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentDiscussions.map((discussion) => (
                                        <div key={discussion.id} className="flex items-start space-x-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100 dark:bg-green-900">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/forum/${discussion.id}`}
                                                    className="font-medium hover:underline text-sm truncate block"
                                                >
                                                    {discussion.title}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">
                                                    {discussion.game?.title && (
                                                        <span>{discussion.game.title} • </span>
                                                    )}
                                                    {new Date(discussion.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Empty State for New Users */}
                {stats.totalGames === 0 && (
                    <Card className="text-center">
                        <CardContent className="py-12">
                            <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                                <Gamepad2 className="h-12 w-12 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Welcome to Game Hub!</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Get started by uploading your first game, creating an update, or joining discussions in the forum.
                            </p>
                            <div className="flex justify-center gap-2">
                                <Button asChild>
                                    <Link href="/games/create">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Your First Game
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/browse">
                                        Browse Games
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppSidebarLayout>
    );
}
