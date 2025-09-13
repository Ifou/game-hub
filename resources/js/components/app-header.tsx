import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    FileText,
    Gamepad2,
    LayoutGrid,
    Menu,
    MessageSquare,
    Plus,
    Search,
    Shield,
    Upload,
    User,
    Users
} from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const publicNavItems: NavItem[] = [
    {
        title: 'Browse',
        href: '/browse',
        icon: Search,
    },
    {
        title: 'Forum',
        href: '/forum',
        icon: MessageSquare,
    },
];

const authNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'My Games',
        href: '/my-games',
        icon: Gamepad2,
    },
    {
        title: 'Updates',
        href: '/updates',
        icon: FileText,
    },
];

const quickActions: NavItem[] = [
    {
        title: 'Upload Game',
        href: '/games/create',
        icon: Upload,
    },
    {
        title: 'Create Update',
        href: '/updates/create',
        icon: FileText,
    },
    {
        title: 'Start Discussion',
        href: '/forum/create',
        icon: MessageSquare,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: Shield,
    },
    {
        title: 'User Management',
        href: '/admin/users',
        icon: Users,
    },
];

// const rightNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const isAdmin = auth?.user?.role === 'admin';
    const isAuthenticated = !!auth?.user;
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-6 w-6 rounded bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 flex items-center justify-center">
                                            <AppLogoIcon className="h-4 w-4 fill-current text-white" />
                                        </div>
                                        <span className="font-bold text-lg">GameHub</span>
                                    </div>
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-6">
                                            {/* Main Navigation */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Main</h4>
                                                {/* Public navigation items */}
                                                {publicNavItems.map((item) => (
                                                    <Link key={item.title} href={item.href} className="flex items-center space-x-3 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                                {/* Authenticated navigation items */}
                                                {isAuthenticated && authNavItems.map((item) => (
                                                    <Link key={item.title} href={item.href} className="flex items-center space-x-3 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            {/* Quick Actions - Only for authenticated users */}
                                            {isAuthenticated && (
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick Actions</h4>
                                                    {quickActions.map((item) => (
                                                        <Link key={item.title} href={item.href} className="flex items-center space-x-3 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                                            {item.icon && <Icon iconNode={item.icon} className="h-4 w-4" />}
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Admin Navigation */}
                                            {isAdmin && (
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Administration</h4>
                                                    {adminNavItems.map((item) => (
                                                        <Link key={item.title} href={item.href} className="flex items-center space-x-3 font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                            {item.icon && <Icon iconNode={item.icon} className="h-4 w-4" />}
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                            {isAuthenticated ? (
                                                <Link href="/forum" className="flex items-center space-x-3 font-medium text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                                    <MessageSquare className="h-4 w-4" />
                                                    <span>Browse Forum</span>
                                                </Link>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Link href="/login" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                                        Log in
                                                    </Link>
                                                    <Link href="/register" className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                                                        Sign up
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/profile" prefetch className="flex items-center space-x-2">
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {/* Public navigation items */}
                                {publicNavItems.map((item, index) => (
                                    <NavigationMenuItem key={`public-${index}`} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}

                                {/* Authenticated navigation items */}
                                {isAuthenticated && authNavItems.map((item, index) => (
                                    <NavigationMenuItem key={`auth-${index}`} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                        {page.url === item.href && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}

                                {/* Admin Navigation */}
                                {isAdmin && (
                                    <>
                                        <div className="mx-2 h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
                                        {adminNavItems.map((item, index) => (
                                            <NavigationMenuItem key={`admin-${index}`} className="relative flex h-full items-center">
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        navigationMenuTriggerStyle(),
                                                        page.url === item.href && activeItemStyles,
                                                        'h-9 cursor-pointer px-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
                                                    )}
                                                >
                                                    {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                    {item.title}
                                                </Link>
                                                {page.url === item.href && (
                                                    <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-red-600 dark:bg-red-400"></div>
                                                )}
                                            </NavigationMenuItem>
                                        ))}
                                    </>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            {/* <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button> */}

                            {/* Quick Action Buttons */}
                            {/* <div className="hidden lg:flex items-center space-x-1">
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="/games/create"
                                                className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                <span className="sr-only">Upload Game</span>
                                                <Upload className="size-4 opacity-80 group-hover:opacity-100" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Upload Game</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="/updates/create"
                                                className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                <span className="sr-only">Create Update</span>
                                                <FileText className="size-4 opacity-80 group-hover:opacity-100" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Create Update</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="/forum/create"
                                                className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                <span className="sr-only">Start Discussion</span>
                                                <MessageSquare className="size-4 opacity-80 group-hover:opacity-100" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Start Discussion</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="group ml-1 h-9 w-9 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                                            >
                                                <span className="sr-only">Notifications</span>
                                                <Bell className="size-4 opacity-80 group-hover:opacity-100" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Notifications</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div> */}
                        </div>

                        {/* User Menu - Only show for authenticated users */}
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            /* Guest user - Show login/register buttons */
                            <div className="flex items-center space-x-2">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
