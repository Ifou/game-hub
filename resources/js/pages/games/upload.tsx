import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Cloud,
    FileText,
    Gamepad2,
    ImageIcon,
    Tag,
    Upload,
    Users,
    Zap
} from 'lucide-react';
import { FormEvent, useState } from 'react';

interface Props extends SharedData { }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile',
    },
    {
        title: 'Upload Game',
        href: '/games/create',
    },
];

const gameCategories = [
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'arcade', label: 'Arcade' },
    { value: 'puzzle', label: 'Puzzle' },
    { value: 'racing', label: 'Racing' },
    { value: 'rpg', label: 'RPG' },
    { value: 'simulation', label: 'Simulation' },
    { value: 'strategy', label: 'Strategy' },
    { value: 'sports', label: 'Sports' },
    { value: 'platformer', label: 'Platformer' },
    { value: 'shooter', label: 'Shooter' },
    { value: 'other', label: 'Other' }
];

export default function UploadGame() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        gameFile: null as File | null,
        thumbnailFile: null as File | null,
        screenshots: [] as File[],
    });

    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('tags', formData.tags);

        if (formData.gameFile) {
            data.append('game_file', formData.gameFile);
        }
        if (formData.thumbnailFile) {
            data.append('thumbnail', formData.thumbnailFile);
        }
        formData.screenshots.forEach((file, index) => {
            data.append(`screenshots[${index}]`, file);
        });

        router.post('/games', data, {
            onSuccess: (page) => {
                // Redirect to the newly created game page or profile
                router.visit('/profile');
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                setIsUploading(false);
            },
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Game" />

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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Upload Your Game</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Share your game with the GameHub community
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Basic Information
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Game Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Enter your game title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="Describe your game, its features, and gameplay..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Select a category</option>
                                        {gameCategories.map((category) => (
                                            <option key={category.value} value={category.value}>{category.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="indie, pixel-art, retro (comma separated)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Cloud className="h-5 w-5" />
                            Files
                        </h2>

                        <div className="space-y-6">
                            {/* Game File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Game File * (.zip, .rar, .7z - Max 100MB)
                                </label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-6 text-center">
                                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                    <input
                                        type="file"
                                        accept=".zip,.rar,.7z"
                                        onChange={(e) => setFormData({ ...formData, gameFile: e.target.files?.[0] || null })}
                                        className="hidden"
                                        id="game-file"
                                    />
                                    <label htmlFor="game-file" className="cursor-pointer">
                                        <span className="text-orange-600 font-medium hover:text-orange-700">
                                            Click to upload
                                        </span>
                                        <span className="text-slate-500"> or drag and drop</span>
                                    </label>
                                    {formData.gameFile && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                            Selected: {formData.gameFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Thumbnail Image * (.jpg, .png - Max 5MB)
                                </label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-6 text-center">
                                    <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) => setFormData({ ...formData, thumbnailFile: e.target.files?.[0] || null })}
                                        className="hidden"
                                        id="thumbnail-file"
                                    />
                                    <label htmlFor="thumbnail-file" className="cursor-pointer">
                                        <span className="text-orange-600 font-medium hover:text-orange-700">
                                            Click to upload
                                        </span>
                                        <span className="text-slate-500"> or drag and drop</span>
                                    </label>
                                    {formData.thumbnailFile && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                            Selected: {formData.thumbnailFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="lg:col-span-2 flex items-center justify-between pt-4">
                        <Link
                            href="/profile"
                            className="px-6 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isUploading || !formData.title || !formData.description || !formData.category || !formData.gameFile || !formData.thumbnailFile}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isUploading ? (
                                <>
                                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Gamepad2 className="h-4 w-4 mr-2" />
                                    Upload Game
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
