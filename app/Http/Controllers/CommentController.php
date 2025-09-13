<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Discussion;
use App\Models\Update;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    use AuthorizesRequests;

    /**
     * Store a new comment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'commentable_type' => 'required|string|in:App\Models\Discussion,App\Models\Update',
            'commentable_id' => 'required|integer',
            'parent_id' => 'nullable|exists:comments,id',
            'content' => 'required|string|max:5000',
        ]);

        // Find the commentable model
        $commentableClass = $validated['commentable_type'];
        $commentable = $commentableClass::findOrFail($validated['commentable_id']);

        // Check if the parent comment belongs to the same commentable
        if ($validated['parent_id']) {
            $parentComment = Comment::findOrFail($validated['parent_id']);
            if ($parentComment->commentable_type !== $validated['commentable_type'] ||
                $parentComment->commentable_id !== $validated['commentable_id']) {
                abort(422, 'Parent comment does not belong to the same discussion/update.');
            }
        }

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'commentable_type' => $validated['commentable_type'],
            'commentable_id' => $validated['commentable_id'],
            'parent_id' => $validated['parent_id'],
            'content' => $validated['content'],
        ]);

        // Update comment count in the parent model
        if ($commentable instanceof Discussion) {
            $commentable->increment('replies_count');
            $commentable->update(['last_activity_at' => now()]);
        } elseif ($commentable instanceof Update) {
            $commentable->increment('comments_count');
        }

        $comment->load('user');

        return response()->json([
            'comment' => $comment,
            'message' => 'Comment posted successfully!'
        ]);
    }

    /**
     * Update a comment.
     */
    public function update(Request $request, Comment $comment)
    {
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $comment->update([
            'content' => $validated['content'],
            'edited_at' => now(),
        ]);

        return response()->json([
            'comment' => $comment,
            'message' => 'Comment updated successfully!'
        ]);
    }

    /**
     * Delete a comment.
     */
    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $commentable = $comment->commentable;

        $comment->delete();

        // Update comment count in the parent model
        if ($commentable instanceof Discussion) {
            $commentable->decrement('replies_count');
        } elseif ($commentable instanceof Update) {
            $commentable->decrement('comments_count');
        }

        return response()->json([
            'message' => 'Comment deleted successfully!'
        ]);
    }

    /**
     * Get comments for a specific commentable.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'commentable_type' => 'required|string|in:App\Models\Discussion,App\Models\Update',
            'commentable_id' => 'required|integer',
        ]);

        $commentableClass = $validated['commentable_type'];
        $commentable = $commentableClass::findOrFail($validated['commentable_id']);

        $comments = $commentable->comments()
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->topLevel()
            ->latest()
            ->paginate(20);

        return response()->json($comments);
    }
}
