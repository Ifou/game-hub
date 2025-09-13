import { useState, useEffect } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Reply, Edit, Trash2, Send, Heart, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Comment {
    id: number;
    content: string;
    upvotes: number;
    downvotes: number;
    created_at: string;
    updated_at: string;
    edited_at?: string;
    user: {
        id: number;
        name: string;
        profile_picture?: string;
    };
    replies?: Comment[];
    parent_id?: number;
}

interface CommentSectionProps {
    commentableType: 'App\\Models\\Discussion' | 'App\\Models\\Update';
    commentableId: number;
    currentUserId?: number;
    className?: string;
}

interface CommentItemProps {
    comment: Comment;
    currentUserId?: number;
    onReply: (parentId: number) => void;
    onEdit: (comment: Comment) => void;
    onDelete: (commentId: number) => void;
    depth?: number;
}

function CommentItem({ comment, currentUserId, onReply, onEdit, onDelete, depth = 0 }: CommentItemProps) {
    const [showReplies, setShowReplies] = useState(true);
    const maxDepth = 3;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className={`${depth > 0 ? 'ml-6 border-l-2 border-slate-200 dark:border-slate-700 pl-4' : ''}`}>
            <div className="flex gap-3 group">
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage
                        src={comment.user.profile_picture ? `/storage/${comment.user.profile_picture}` : undefined}
                        alt={comment.user.name}
                    />
                    <AvatarFallback className="text-xs">
                        {comment.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            href={`/users/${comment.user.id}`}
                            className="font-medium text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {comment.user.name}
                        </Link>
                        <span className="text-xs text-slate-500">
                            {formatDate(comment.created_at)}
                        </span>
                        {comment.edited_at && (
                            <span className="text-xs text-slate-400">(edited)</span>
                        )}
                    </div>

                    <div className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {comment.content}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <button
                            onClick={() => onReply(comment.id)}
                            className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                            <Reply className="h-3 w-3" />
                            Reply
                        </button>

                        <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{comment.upvotes}</span>
                        </div>

                        {currentUserId === comment.user.id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                                        <MoreHorizontal className="h-3 w-3" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(comment)}>
                                        <Edit className="h-3 w-3 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(comment.id)}
                                        className="text-red-600 dark:text-red-400"
                                    >
                                        <Trash2 className="h-3 w-3 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3">
                            {depth < maxDepth ? (
                                <div className="space-y-3">
                                    {showReplies && comment.replies.map((reply) => (
                                        <CommentItem
                                            key={reply.id}
                                            comment={reply}
                                            currentUserId={currentUserId}
                                            onReply={onReply}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            depth={depth + 1}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowReplies(!showReplies)}
                                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    {showReplies ? 'Hide' : 'Show'} {comment.replies.length} more replies
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CommentSection({ commentableType, commentableId, currentUserId, className = '' }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const [content, setContent] = useState('');
    const [error, setError] = useState<string>('');

    const fetchComments = async () => {
        try {
            const response = await fetch(`/comments?commentable_type=${encodeURIComponent(commentableType)}&commentable_id=${commentableId}`);

            // Check if response is HTML (likely an error page)
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('text/html')) {
                console.error('Received HTML response instead of JSON. Likely authentication or routing error.');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            setComments(result.data || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [commentableType, commentableId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        setSubmitting(true);
        setError('');

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    commentable_type: commentableType,
                    commentable_id: commentableId,
                    parent_id: replyingTo,
                    content: content.trim(),
                }),
            });

            // Check if response is HTML (likely an error page)
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('text/html')) {
                setError('Authentication required. Please log in to comment.');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }));
                throw new Error(errorData.message || 'Failed to post comment');
            }

            const result = await response.json();

            // Reset form
            setContent('');
            setReplyingTo(null);
            setEditingComment(null);

            // Refresh comments
            await fetchComments();

        } catch (error) {
            console.error('Failed to post comment:', error);
            setError(error instanceof Error ? error.message : 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = (parentId: number) => {
        setReplyingTo(replyingTo === parentId ? null : parentId);
        setEditingComment(null);
    };

    const handleEdit = (comment: Comment) => {
        setEditingComment(comment);
        setContent(comment.content);
        setReplyingTo(null);
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await fetch(`/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const cancelEdit = () => {
        setEditingComment(null);
        setReplyingTo(null);
        setContent('');
        setError('');
    };

    if (loading) {
        return (
            <div className={`${className} animate-pulse`}>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3">
                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
            </div>

            {/* Comment Form */}
            {currentUserId && (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <textarea
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        rows={3}
                    />
                    {error && (
                        <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                    )}
                    <div className="flex items-center gap-2">
                        <Button
                            type="submit"
                            disabled={submitting || !content.trim()}
                            size="sm"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {editingComment ? 'Update' : replyingTo ? 'Reply' : 'Comment'}
                        </Button>
                        {(replyingTo || editingComment) && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
