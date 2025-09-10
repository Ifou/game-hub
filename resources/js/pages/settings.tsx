import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    Bell,
    Lock,
    Mail,
    Save,
    Settings as SettingsIcon,
    User as UserIcon
} from 'lucide-react';

interface Props extends SharedData {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
];

export default function Settings() {
    const { user } = usePage<Props>().props;

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />

            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Manage your account preferences and privacy settings
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Profile Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <UserIcon className="h-5 w-5" />
                            Profile Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Tell the community about yourself..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notification Preferences
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Email Notifications
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Receive notifications about your games and discussions
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Game Comments
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Get notified when someone comments on your games
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Forum Replies
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Get notified when someone replies to your forum posts
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Privacy & Security
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Profile Visibility
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Make your profile visible to other users
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Game Statistics
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Show download counts and ratings on your games
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                            </div>

                            <div>
                                <button className="w-full mt-4 px-4 py-2 text-sm text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </AppSidebarLayout>
    );
}
