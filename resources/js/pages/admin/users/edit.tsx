import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem, type User } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';

interface EditUserProps {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/admin/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

export default function EditUser({ user }: EditUserProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />

            <div className="flex-1 space-y-8 p-6 pt-6">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                        <p className="text-muted-foreground">Update user information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main form section - takes 2/3 of the width on large screens */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                                <CardDescription>
                                    Update the user's information below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form
                                    method="put"
                                    action={`/admin/users/${user.id}`}
                                    className="space-y-6"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        autoComplete="name"
                                                        defaultValue={user.name}
                                                        placeholder="Enter full name"
                                                        required
                                                    />
                                                    <InputError message={errors.name} />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        autoComplete="email"
                                                        defaultValue={user.email}
                                                        placeholder="Enter email address"
                                                        required
                                                    />
                                                    <InputError message={errors.email} />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="role">Role</Label>
                                                    <Select name="role" defaultValue={user.role || 'user'}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">User</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={errors.role} />
                                                </div>

                                                {/* Empty div to maintain grid structure */}
                                                <div></div>
                                            </div>

                                            <div className="border-t pt-6">
                                                <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="password">New Password</Label>
                                                        <Input
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            autoComplete="new-password"
                                                            placeholder="Leave blank to keep current password"
                                                        />
                                                        <InputError message={errors.password} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                                        <Input
                                                            id="password_confirmation"
                                                            name="password_confirmation"
                                                            type="password"
                                                            autoComplete="new-password"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <InputError message={errors.password_confirmation} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end space-x-4 pt-6 border-t">
                                                <Button variant="outline" asChild>
                                                    <Link href="/admin/users">Cancel</Link>
                                                </Button>
                                                <Button disabled={processing}>
                                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                                    Update User
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar section - takes 1/3 of the width on large screens */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                                <CardDescription>
                                    Additional details about this user
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                                    <p className="text-sm">{user.id}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Current Role</Label>
                                    <p className="text-sm capitalize">{user.role || 'user'}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Email Verified</Label>
                                    <p className="text-sm">
                                        {user.email_verified_at ? (
                                            <span className="text-green-600">Verified</span>
                                        ) : (
                                            <span className="text-red-600">Not Verified</span>
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <p className="text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                                    <p className="text-sm">{new Date(user.updated_at).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
