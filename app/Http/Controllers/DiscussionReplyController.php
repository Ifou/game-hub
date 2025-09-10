<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use App\Models\DiscussionReply;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DiscussionReplyController extends Controller
{
    use AuthorizesRequests;

    /**
     * Store a newly created reply.
     */
    public function store(Request $request, Discussion $discussion)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
            'parent_id' => 'nullable|exists:discussion_replies,id',
        ]);

        // Verify parent reply belongs to the same discussion
        if ($validated['parent_id']) {
            $parentReply = DiscussionReply::findOrFail($validated['parent_id']);
            if ($parentReply->discussion_id !== $discussion->id) {
                abort(400, 'Invalid parent reply.');
            }
        }

        $reply = DiscussionReply::create([
            'discussion_id' => $discussion->id,
            'user_id' => Auth::id(),
            'parent_id' => $validated['parent_id'],
            'content' => $validated['content'],
        ]);

        // Update discussion activity and reply count
        $discussion->increment('replies_count');
        $discussion->update(['last_activity_at' => now()]);

        return back()->with('success', 'Reply posted successfully!');
    }

    /**
     * Update the specified reply.
     */
    public function update(Request $request, DiscussionReply $reply)
    {
        $this->authorize('update', $reply);

        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $reply->update([
            'content' => $validated['content'],
            'edited_at' => now(),
        ]);

        return back()->with('success', 'Reply updated successfully!');
    }

    /**
     * Remove the specified reply.
     */
    public function destroy(DiscussionReply $reply)
    {
        $this->authorize('delete', $reply);

        $discussion = $reply->discussion;

        // Soft delete or mark as deleted instead of hard delete to preserve thread structure
        $reply->update(['content' => '[deleted]']);

        // Decrement reply count
        $discussion->decrement('replies_count');

        return back()->with('success', 'Reply deleted successfully!');
    }

    /**
     * Vote on a reply (upvote/downvote).
     */
    public function vote(Request $request, DiscussionReply $reply)
    {
        $validated = $request->validate([
            'type' => 'required|in:upvote,downvote',
        ]);

        // In a real app, you'd track user votes to prevent duplicate voting
        // For now, we'll just increment the count
        if ($validated['type'] === 'upvote') {
            $reply->increment('upvotes');
        } else {
            $reply->increment('downvotes');
        }

        return response()->json([
            'upvotes' => $reply->upvotes,
            'downvotes' => $reply->downvotes,
            'net_votes' => $reply->net_votes,
        ]);
    }
}
