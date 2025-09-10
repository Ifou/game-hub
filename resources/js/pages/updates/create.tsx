import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Bell,
    Calendar,
    FileText,
    Gamepad2,
    ImageIcon,
    Send,
    Tag,
    Users
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props extends SharedData { }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile',
    },
    {
        title: 'Create Update',
        href: '/updates/create',
    },
];

const updateTypes = [
    'Game Release', 'Bug Fix', 'New Feature', 'Update', 'Announcement', 'Event', 'Other'
];

export default function CreateUpdate() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: '',
        gameId: '',
        tags: '',
        imageFile: null as File | null,
        isImportant: false,
    });

    const [isPublishing, setIsPublishing] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsPublishing(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('type', formData.type);
        data.append('game_id', formData.gameId);
        data.append('tags', formData.tags);
        data.append('is_important', formData.isImportant.toString());

        if (formData.imageFile) {
            data.append('image', formData.imageFile);
        }

        router.post('/updates', data, {
            onSuccess: () => {
                // Redirect to profile or updates list
            },
            onError: () => {
                setIsPublishing(false);
            },
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Update" />

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Profile
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create Update</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Share news, updates, and announcements with your followers
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Update Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Update Details
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Update Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="What's new? What are you announcing?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Share details about your update, new features, bug fixes, or any news you want to communicate..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Update Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select update type</option>
                                        {updateTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Related Game (Optional)
                                    </label>
                                    <select
                                        value={formData.gameId}
                                        onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select a game</option>
                                        {/* This would be populated with user's games */}
                                        <option value="1">Space Explorer</option>
                                        <option value="2">Puzzle Master</option>
                                        <option value="3">Retro Racer</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="update, news, release, patch (comma separated)"
                                />
                            </div>

                            {/* Important Update Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="important"
                                    checked={formData.isImportant}
                                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                                <label htmlFor="important" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Mark as important update
                                </label>
                                <div className="group relative">
                                    <div className="h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-600 text-white text-xs flex items-center justify-center cursor-help">
                                        ?
                                    </div>
                                    <div className="absolute bottom-6 left-0 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                        Important updates get highlighted and may send notifications
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" />
                            Featured Image (Optional)
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Update Image (.jpg, .png - Max 5MB)
                            </label>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-6 text-center">
                                <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                                    className="hidden"
                                    id="image-file"
                                />
                                <label htmlFor="image-file" className="cursor-pointer">
                                    <span className="text-green-600 font-medium hover:text-green-700">
                                        Click to upload
                                    </span>
                                    <span className="text-slate-500"> or drag and drop</span>
                                </label>
                                {formData.imageFile && (
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Selected: {formData.imageFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Preview
                        </h2>

                        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/50">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                    U
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-slate-900 dark:text-white">Your Name</span>
                                        <span className="text-xs text-slate-500">•</span>
                                        <span className="text-xs text-slate-500">Now</span>
                                        {formData.isImportant && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                                Important
                                            </span>
                                        )}
                                        {formData.type && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                {formData.type}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                        {formData.title || 'Your update title will appear here'}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                                        {formData.content || 'Your update content will be shown here. This is how it will look to your followers.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <Link
                            href="/profile"
                            className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isPublishing || !formData.title || !formData.content || !formData.type}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isPublishing ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Publish Update
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
