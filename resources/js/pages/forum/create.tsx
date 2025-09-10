import AppSidebarLayout from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Hash,
    HelpCircle,
    MessageSquare,
    Pin,
    Send,
    Tag,
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
        title: 'Start Discussion',
        href: '/forum/create',
    },
];

const discussionCategories = [
    { id: 'general', name: 'General Discussion', icon: MessageSquare },
    { id: 'game-dev', name: 'Game Development', icon: Zap },
    { id: 'showcase', name: 'Game Showcase', icon: Pin },
    { id: 'feedback', name: 'Feedback & Reviews', icon: Users },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
    { id: 'off-topic', name: 'Off-Topic', icon: Hash },
];

export default function CreateDiscussion() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        tags: '',
        isPinned: false,
        allowComments: true,
    });

    const [isCreating, setIsCreating] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const data = {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            tags: formData.tags,
            is_pinned: formData.isPinned,
            allow_comments: formData.allowComments,
        };

        router.post('/forum', data, {
            onSuccess: () => {
                // Redirect to forum or the new discussion
            },
            onError: () => {
                setIsCreating(false);
            },
        });
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Start Discussion" />

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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Start a Discussion</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">
                        Share ideas, ask questions, and connect with the gaming community
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Discussion Details */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Discussion Details
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Discussion Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="What would you like to discuss?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {discussionCategories.map((category) => (
                                        <label
                                            key={category.id}
                                            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.category === category.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category.id}
                                                checked={formData.category === category.id}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="sr-only"
                                            />
                                            <category.icon className={`h-5 w-5 mr-3 ${formData.category === category.id ? 'text-blue-600' : 'text-slate-400'
                                                }`} />
                                            <span className={`text-sm font-medium ${formData.category === category.id
                                                ? 'text-blue-900 dark:text-blue-300'
                                                : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                {category.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Content *
                                </label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Share your thoughts, ask a question, or start a conversation..."
                                />
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    You can use markdown for formatting. Be respectful and follow community guidelines.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="discussion, help, question, indie (comma separated)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discussion Options */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Discussion Options
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="allow-comments" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Allow Comments
                                    </label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Let other users reply to your discussion
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    id="allow-comments"
                                    checked={formData.allowComments}
                                    onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Preview
                        </h2>

                        <div className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/50">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                    U
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-medium text-slate-900 dark:text-white">Your Name</span>
                                        <span className="text-xs text-slate-500">•</span>
                                        <span className="text-xs text-slate-500">Now</span>
                                        {formData.category && (
                                            <>
                                                <span className="text-xs text-slate-500">•</span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                    {discussionCategories.find(cat => cat.id === formData.category)?.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                        {formData.title || 'Your discussion title will appear here'}
                                    </h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {formData.content || 'Your discussion content will be shown here. This is how it will look to other community members.'}
                                        </p>
                                    </div>
                                    {formData.tags && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {formData.tags.split(',').map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-300"
                                                >
                                                    #{tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
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
                            disabled={isCreating || !formData.title || !formData.content || !formData.category}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isCreating ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Start Discussion
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
