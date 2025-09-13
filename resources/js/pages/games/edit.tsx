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

interface Game {
    id: number;
    title: string;
    description: string;
    category: string;
    tags: string[];
    version: string;
    min_players: number | null;
    max_players: number | null;
    file_path: string;
    thumbnail_path: string | null;
    status: string;
}

interface Props extends SharedData {
    game: Game;
}

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

export default function EditGame({ game }: Props) {
    const [formData, setFormData] = useState({
        title: game.title,
        description: game.description,
        category: game.category,
        tags: game.tags.join(', '),
        version: game.version,
        min_players: game.min_players?.toString() || '',
        max_players: game.max_players?.toString() || '',
        gameFile: null as File | null,
        thumbnailFile: null as File | null,
        screenshots: [] as File[],
    });

    const [isUpdating, setIsUpdating] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'My Games',
            href: '/my-games',
        },
        {
            title: game.title,
            href: `/games/${game.id}`,
        },
        {
            title: 'Edit',
            href: `/games/${game.id}/edit`,
        },
    ];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('tags', formData.tags);
        data.append('version', formData.version);

        // Only append player counts if they have values and are valid numbers
        if (formData.min_players && !isNaN(Number(formData.min_players))) {
            data.append('min_players', formData.min_players);
        }
        if (formData.max_players && !isNaN(Number(formData.max_players))) {
            data.append('max_players', formData.max_players);
        }

        if (formData.gameFile) {
            data.append('game_file', formData.gameFile);
        }
        if (formData.thumbnailFile) {
            data.append('thumbnail', formData.thumbnailFile);
        }
        formData.screenshots.forEach((file, index) => {
            data.append(`screenshots[${index}]`, file);
        });

        // Laravel requires _method for PUT requests with FormData
        data.append('_method', 'PUT');

        // Debug: log the form data
        console.log('Form data being sent:');
        for (let [key, value] of data.entries()) {
            console.log(key, value);
        }

        router.post(`/games/${game.id}`, data, {
            onSuccess: () => {
                console.log('Game updated successfully!');
                // Will redirect to the game show page
            },
            onError: (errors) => {
                console.error('Update errors:', errors);
                console.error('Validation failed with errors:', errors);
                setIsUpdating(false);
            },
            onFinish: () => {
                setIsUpdating(false);
            }
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${game.title}`} />

            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href={`/games/${game.id}`}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Game
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Game</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Update your game information and files
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Basic Information</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Update the core details of your game</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Game Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Game Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Enter your game's title"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {gameCategories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Version */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Version
                                </label>
                                <input
                                    type="text"
                                    value={formData.version}
                                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                                    placeholder="e.g., 1.0.0"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="Enter tags separated by commas"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your game, its features, and gameplay..."
                                rows={6}
                                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                required
                            />
                        </div>
                    </div>

                    {/* Game Settings */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Game Settings</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Configure multiplayer and other settings</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Min Players */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Minimum Players
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_players}
                                    onChange={(e) => setFormData(prev => ({ ...prev, min_players: e.target.value }))}
                                    placeholder="1"
                                    min="1"
                                    max="100"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                            </div>

                            {/* Max Players */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Maximum Players
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_players}
                                    onChange={(e) => setFormData(prev => ({ ...prev, max_players: e.target.value }))}
                                    placeholder="4"
                                    min="1"
                                    max="100"
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* File Uploads */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Files</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Update your game files and assets</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Game File */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Game File (Leave empty to keep current file)
                                </label>
                                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                                    <Cloud className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                    <div className="text-slate-600 dark:text-slate-300 mb-2">
                                        <span className="font-medium">Click to upload</span> or drag and drop
                                    </div>
                                    <div className="text-sm text-slate-500">ZIP, RAR, or 7Z files up to 100MB</div>
                                    <input
                                        type="file"
                                        onChange={(e) => setFormData(prev => ({ ...prev, gameFile: e.target.files?.[0] || null }))}
                                        accept=".zip,.rar,.7z"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                {formData.gameFile && (
                                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Selected: {formData.gameFile.name}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Thumbnail (Leave empty to keep current thumbnail)
                                </label>
                                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                                    <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                    <div className="text-slate-600 dark:text-slate-300 mb-2">
                                        <span className="font-medium">Click to upload</span> or drag and drop
                                    </div>
                                    <div className="text-sm text-slate-500">PNG, JPG, or GIF up to 5MB</div>
                                    <input
                                        type="file"
                                        onChange={(e) => setFormData(prev => ({ ...prev, thumbnailFile: e.target.files?.[0] || null }))}
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                {formData.thumbnailFile && (
                                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        Selected: {formData.thumbnailFile.name}
                                    </div>
                                )}
                                {game.thumbnail_path && !formData.thumbnailFile && (
                                    <div className="mt-2">
                                        <img
                                            src={`/storage/${game.thumbnail_path}`}
                                            alt="Current thumbnail"
                                            className="w-32 h-32 object-cover rounded border"
                                        />
                                        <p className="text-sm text-slate-500 mt-1">Current thumbnail</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4">
                        <Link
                            href={`/games/${game.id}`}
                            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Updating Game...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4" />
                                    Update Game
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
