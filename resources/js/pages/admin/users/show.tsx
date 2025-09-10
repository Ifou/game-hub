import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Mail, Shield, User as UserIcon } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';

interface ShowUserProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
    {
        title: 'User Details',
        href: '#',
    },
];

export default function ShowUser({ user }: ShowUserProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User: ${user.name}`} />

            <div className="flex-1 space-y-8 p-6 pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/users">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Link>
                        </Button>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                            <p className="text-muted-foreground">Viewing user information</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* User Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <UserIcon className="h-5 w-5" />
                                <span>User Information</span>
                            </CardTitle>
                            <CardDescription>
                                Basic user account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                    <span className="text-lg font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">User ID: #{user.id}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{user.email}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                        {user.role || 'user'}
                                    </Badge>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                            <CardDescription>
                                Current account verification and activity status
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Email Verified</span>
                                <Badge variant={user.email_verified_at ? 'default' : 'destructive'}>
                                    {user.email_verified_at ? 'Verified' : 'Unverified'}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Account Created</span>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Last Updated</span>
                                <span className="text-sm text-muted-foreground">
                                    {new Date(user.updated_at).toLocaleDateString()}
                                </span>
                            </div>

                            {user.role === 'admin' && (
                                <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                            Administrator Account
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                                        This user has full administrative privileges.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
