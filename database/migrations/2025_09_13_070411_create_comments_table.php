<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');

            // Polymorphic relationship to allow comments on multiple models
            $table->morphs('commentable');

            $table->text('content');
            $table->integer('upvotes')->default(0);
            $table->integer('downvotes')->default(0);
            $table->boolean('is_moderator_comment')->default(false);
            $table->boolean('is_highlighted')->default(false);
            $table->timestamp('edited_at')->nullable();
            $table->timestamps();

            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
