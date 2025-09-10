<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'tags',
        'file_path',
        'thumbnail_path',
        'version',
        'min_players',
        'max_players',
        'downloads_count',
        'average_rating',
        'total_ratings',
        'is_featured',
        'status'
    ];

    protected $casts = [
        'tags' => 'array',
        'is_featured' => 'boolean',
        'average_rating' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function updates(): HasMany
    {
        return $this->hasMany(Update::class);
    }

    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class);
    }

    // Scopes
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Accessors
    public function getFormattedDownloadsAttribute()
    {
        if ($this->downloads_count >= 1000000) {
            return number_format($this->downloads_count / 1000000, 1) . 'M';
        } elseif ($this->downloads_count >= 1000) {
            return number_format($this->downloads_count / 1000, 1) . 'K';
        }
        return $this->downloads_count;
    }
}
