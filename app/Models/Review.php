<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ColorSize;
use Illuminate\Support\Facades\DB;

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
        'color_size_id',
        'user_id',
    ];

    public static function reviewsOfProduct ($id, $rpp) {
        return DB::table('reviews')->whereIn('color_size_id', ColorSize::listOfProduct($id))->paginate($rpp);
    }
    public static function ifStarsEquals ($id, $stars, $rpp) {
        return DB::table('reviews')->whereIn('color_size_id', ColorSize::listOfProduct($id))->where('stars', $stars)->paginate($rpp);
    }
    public static function ifHasReviewEquals ($id, $hasReview, $rpp) {
        return DB::table('reviews')->whereIn('color_size_id', ColorSize::listOfProduct($id))->where('has_review', $hasReview)->paginate($rpp);
    }
}
