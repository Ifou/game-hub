import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Calendar, FileText, Globe, Save, X, ArrowLeft } from 'lucide-react';
import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { Update, Game } from '@/types';

interface Props {
    update: Update;
    games: Game[];
}

const updateTypes = [
    { value: 'update', label: 'Update' },
    { value: 'patch', label: 'Patch' },
    { value: 'hotfix', label: 'Hotfix' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'news', label: 'News' }
];

const importanceLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
];

export default function EditUpdate({ update, games }: Props) {
    const [isUpdating, setIsUpdating] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: update.title,
        content: update.content,
        type: update.type,
        game_id: update.game_id || '',
        importance: update.importance,
        is_pinned: update.is_pinned,
        published_at: update.published_at ? new Date(update.published_at).toISOString().slice(0, 16) : '',
    });

    const selectedGame = games.find(game => game.id === parseInt(data.game_id as string));

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        // Convert is_pinned to proper boolean
        const submitData = {
            ...data,
            is_pinned: Boolean(data.is_pinned),
            published_at: data.published_at || null,
        };

        put(`/updates/${update.id}`, {
            ...submitData,
            onSuccess: () => {
                console.log('✅ Update edited successfully!');
            },
            onError: (validationErrors) => {
                console.log('❌ Validation errors:', validationErrors);
                setIsUpdating(false);
            },
            onFinish: () => {
                setIsUpdating(false);
            }
        });
    };

    const canSubmit = data.title && data.content && data.type && data.importance;

    return (
        <AppSidebarLayout>
            <Head title={`Edit ${update.title}`} />

            <div className="w-full px-6 py-6">
                {/* Back button */}
                <Link
                    href={`/updates/${update.id}`}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Update
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-200 mb-2">Edit Update</h1>
                    <p className="text-gray-400">
                        Make changes to your update post. All fields marked with * are required.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600">
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Title *
                                {data.title && <span className="text-green-500 ml-2">✓</span>}
                                {!data.title && <span className="text-red-500 ml-2">✗</span>}
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter update title..."
                                maxLength={255}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Content *
                                {data.content && <span className="text-green-500 ml-2">✓</span>}
                                {!data.content && <span className="text-red-500 ml-2">✗</span>}
                            </label>
                            <textarea
                                id="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={10}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Write your update content here..."
                                maxLength={10000}
                            />
                            <div className="flex justify-between mt-1">
                                <span>
                                    {errors.content && (
                                        <span className="text-sm text-red-600">{errors.content}</span>
                                    )}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {data.content.length}/10,000 characters
                                </span>
                            </div>
                        </div>

                        {/* Type and Importance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Type *
                                    {data.type && <span className="text-green-500 ml-2">✓</span>}
                                    {!data.type && <span className="text-red-500 ml-2">✗</span>}
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as any)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select type...</option>
                                    {updateTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="importance" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Importance *
                                    {data.importance && <span className="text-green-500 ml-2">✓</span>}
                                    {!data.importance && <span className="text-red-500 ml-2">✗</span>}
                                </label>
                                <select
                                    id="importance"
                                    value={data.importance}
                                    onChange={(e) => setData('importance', e.target.value as any)}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select importance...</option>
                                    {importanceLevels.map((level) => (
                                        <option key={level.value} value={level.value}>
                                            {level.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.importance && (
                                    <p className="mt-1 text-sm text-red-600">{errors.importance}</p>
                                )}
                            </div>
                        </div>

                        {/* Game Selection */}
                        <div>
                            <label htmlFor="game_id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Associated Game (Optional)
                            </label>
                            <select
                                id="game_id"
                                value={data.game_id}
                                onChange={(e) => setData('game_id', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="">No game selected</option>
                                {games.map((game) => (
                                    <option key={game.id} value={game.id}>
                                        {game.title}
                                    </option>
                                ))}
                            </select>
                            {selectedGame && (
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    This update will be linked to "{selectedGame.title}"
                                </p>
                            )}
                            {errors.game_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.game_id}</p>
                            )}
                        </div>

                        {/* Publishing Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="published_at" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Publish Date & Time
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                                    <input
                                        type="datetime-local"
                                        id="published_at"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    Leave empty to publish immediately
                                </p>
                                {errors.published_at && (
                                    <p className="mt-1 text-sm text-red-600">{errors.published_at}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Pin Update
                                </label>
                                <div className="flex items-center h-12">
                                    <input
                                        type="checkbox"
                                        id="is_pinned"
                                        checked={data.is_pinned}
                                        onChange={(e) => setData('is_pinned', e.target.checked)}
                                        className="w-4 h-4 text-green-600 border-slate-300 dark:border-slate-600 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="is_pinned" className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                                        Pin this update to the top
                                    </label>
                                </div>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                                    Pinned updates appear at the top of the list
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 flex items-center justify-between rounded-b-lg">
                        <Link
                            href={`/updates/${update.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={processing || isUpdating || !canSubmit}
                            className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${canSubmit && !processing && !isUpdating
                                ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                                : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                                }`}
                            title={!canSubmit ? 'Please fill in all required fields' : 'Save changes'}
                        >
                            <Save className="w-4 h-4" />
                            {processing || isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
