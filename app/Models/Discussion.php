<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Discussion extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',
        'title',
        'content',
        'category',
        'tags',
        'views_count',
        'replies_count',
        'upvotes',
        'downvotes',
        'is_pinned',
        'is_locked',
        'is_featured',
        'last_activity_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
        'is_featured' => 'boolean',
        'last_activity_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(DiscussionReply::class);
    }

    public function latestReplies(): HasMany
    {
        return $this->hasMany(DiscussionReply::class)->latest();
    }

    // Scopes
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeActive($query)
    {
        return $query->orderBy('last_activity_at', 'desc');
    }

    // Accessors
    public function getFormattedViewsAttribute()
    {
        if ($this->views_count >= 1000000) {
            return number_format($this->views_count / 1000000, 1) . 'M';
        } elseif ($this->views_count >= 1000) {
            return number_format($this->views_count / 1000, 1) . 'K';
        }
        return $this->views_count;
    }

    public function getNetVotesAttribute()
    {
        return $this->upvotes - $this->downvotes;
    }
}
