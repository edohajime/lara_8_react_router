<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'review_code',
        'stars',
        'correct_description',
        'review_color',
        'review_material',
        'content',
        'has_review',
        'has_media',
        'has_like',
        'size_id',
        'user_id',
        'product_id',
    ];
}
