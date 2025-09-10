<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiscussionReply extends Model
{
    protected $fillable = [
        'discussion_id',
        'user_id',
        'parent_id',
        'content',
        'upvotes',
        'downvotes',
        'is_moderator_reply',
        'is_highlighted',
        'edited_at'
    ];

    protected $casts = [
        'is_moderator_reply' => 'boolean',
        'is_highlighted' => 'boolean',
        'edited_at' => 'datetime'
    ];

    public function discussion(): BelongsTo
    {
        return $this->belongsTo(Discussion::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(DiscussionReply::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(DiscussionReply::class, 'parent_id');
    }

    // Scopes
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeModeratorReplies($query)
    {
        return $query->where('is_moderator_reply', true);
    }

    public function scopeHighlighted($query)
    {
        return $query->where('is_highlighted', true);
    }

    // Accessors
    public function getNetVotesAttribute()
    {
        return $this->upvotes - $this->downvotes;
    }

    public function getIsEditedAttribute()
    {
        return $this->edited_at !== null;
    }
}
