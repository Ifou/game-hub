<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'parent_id',
        'commentable_type',
        'commentable_id',
        'content',
        'upvotes',
        'downvotes',
        'is_moderator_comment',
        'is_highlighted',
        'edited_at'
    ];

    protected $casts = [
        'is_moderator_comment' => 'boolean',
        'is_highlighted' => 'boolean',
        'edited_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeHighlighted($query)
    {
        return $query->where('is_highlighted', true);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // Accessors
    public function getNetVotesAttribute()
    {
        return $this->upvotes - $this->downvotes;
    }

    public function getDepthAttribute()
    {
        $depth = 0;
        $comment = $this;

        while ($comment->parent_id) {
            $depth++;
            $comment = $comment->parent;
        }

        return $depth;
    }
}
