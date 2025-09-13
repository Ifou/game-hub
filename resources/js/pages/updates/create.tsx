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

interface Game {
    id: number;
    title: string;
}

interface Props extends SharedData {
    games: Game[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'My Updates',
        href: '/updates',
    },
    {
        title: 'Create Update',
        href: '/updates/create',
    },
];

const updateTypes = [
    'update', 'patch', 'hotfix', 'announcement', 'news'
];

const importanceLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
];

export default function CreateUpdate({ games }: Props) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: '',
        gameId: '',
        importance: '',
        isPinned: false,
    });

    const [isPublishing, setIsPublishing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsPublishing(true);

        // Clear any previous errors
        setErrors({});

        // Debug: Log form data
        console.log('Form data:', formData);
        console.log('Title:', formData.title);
        console.log('Content:', formData.content);
        console.log('Type:', formData.type);
        console.log('Importance:', formData.importance);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('type', formData.type);
        data.append('importance', formData.importance);
        data.append('is_pinned', formData.isPinned ? '1' : '0'); // Laravel expects 1/0 for boolean

        if (formData.gameId) {
            data.append('game_id', formData.gameId);
        }

        // Debug: Log FormData
        console.log('Submitting FormData:');
        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }

        router.post('/updates', data, {
            onSuccess: () => {
                console.log('Update created successfully!');
                // Redirect to updates index page
                router.visit('/updates');
            },
            onError: (validationErrors) => {
                console.error('Validation errors:', validationErrors);
                setErrors(validationErrors);
                setIsPublishing(false);
            },
            onFinish: () => {
                console.log('Request finished');
                setIsPublishing(false);
            }
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Update" />

            <div className="w-full px-6 py-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/updates"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Updates
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
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="What's new? What are you announcing?"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                                )}
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
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.content ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                                    placeholder="Share details about your update, new features, bug fixes, or any news you want to communicate..."
                                />
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                                )}
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
                                            <option key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Importance Level *
                                    </label>
                                    <select
                                        required
                                        value={formData.importance}
                                        onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Select importance</option>
                                        {importanceLevels.map((level) => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                    {games?.map((game) => (
                                        <option key={game.id} value={game.id}>
                                            {game.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pinned Update Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="pinned"
                                    checked={formData.isPinned}
                                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                                <label htmlFor="pinned" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Pin this update
                                </label>
                                <div className="group relative">
                                    <div className="h-4 w-4 rounded-full bg-slate-300 dark:bg-slate-600 text-white text-xs flex items-center justify-center cursor-help">
                                        ?
                                    </div>
                                    <div className="absolute bottom-6 left-0 hidden group-hover:block bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                        Pinned updates appear at the top of your updates list
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <Link
                                href="/updates"
                                className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </Link>
                            {/* Debug info */}
                            <div className="mt-2 text-xs text-slate-500">
                                <div>Title: {formData.title ? '✓' : '✗'}</div>
                                <div>Content: {formData.content ? '✓' : '✗'}</div>
                                <div>Type: {formData.type ? '✓' : '✗'}</div>
                                <div>Importance: {formData.importance ? '✓' : '✗'}</div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isPublishing || !formData.title || !formData.content || !formData.type || !formData.importance}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            title={`Button status: ${isPublishing ? 'Publishing...' :
                                !formData.title ? 'Title required' :
                                    !formData.content ? 'Content required' :
                                        !formData.type ? 'Type required' :
                                            !formData.importance ? 'Importance required' : 'Ready to submit'}`}
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
