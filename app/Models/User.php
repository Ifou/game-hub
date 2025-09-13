<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_picture',
        'background_picture',
        'birthdate',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'birthdate' => 'date',
        ];
    }

    /**
     * Check if the user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if the user is a regular user.
     */
    public function isUser(): bool
    {
        return $this->role === 'user' || $this->role === null;
    }

    /**
     * Get the games uploaded by this user.
     */
    public function games()
    {
        return $this->hasMany(Game::class);
    }

    /**
     * Get the updates created by this user.
     */
    public function updates()
    {
        return $this->hasMany(Update::class);
    }

    /**
     * Get the discussions started by this user.
     */
    public function discussions()
    {
        return $this->hasMany(Discussion::class);
    }

    /**
     * Get the discussion replies made by this user.
     */
    public function discussionReplies()
    {
        return $this->hasMany(DiscussionReply::class);
    }

    /**
     * Get the comments made by this user.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
