<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Update extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',
        'title',
        'content',
        'type',
        'importance',
        'views_count',
        'likes_count',
        'comments_count',
        'is_pinned',
        'published_at'
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'published_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    // Scopes
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByImportance($query, $importance)
    {
        return $query->where('importance', $importance);
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
}
