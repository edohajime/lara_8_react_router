<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Models\Product;
use App\Models\Review;
use App\Http\Controllers\Controller;
use App\Models\ReviewMedia;
use App\Models\Size;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ReviewController extends Controller
{

    public function statistic(Request $request) {
        $reviews = Review::where('product_id', $request->get('product_id'))->paginate(15);
        $starCounts = [0, 0, 0, 0, 0];
        $countHasReview = 0;
        $countHasMedia = 0;
        $totalStars = 0;
        $total = 0;

        foreach ($reviews as $review) {
            if ($review->stars === 5) {
                $starCounts[4]++;
            } else if ($review->stars === 4) {
                $starCounts[3]++;
            } else if ($review->stars === 3) {
                $starCounts[2]++;
            } else if ($review->stars === 2) {
                $starCounts[1]++;
            } else {
                $starCounts[0]++;
            }

            if ($review->has_review) {
                $countHasReview++;
            }
            if ($review->has_media) {
                $countHasMedia++;
            }

            $totalStars += $review->stars;
        }

        $avgStar = count($reviews) === 0 ? 5 : $totalStars / count($reviews);
        $num_avgStar = (float) number_format($avgStar, 1, '.', ',');
        $total = $reviews->total();

        $response = [
            "five_stars" => $starCounts[4],
            "four_stars" => $starCounts[3],
            "three_stars" => $starCounts[2],
            "two_stars" => $starCounts[1],
            "one_stars" => $starCounts[0],
            "count_has_review" => $countHasReview,
            "count_has_media" => $countHasMedia,
            "avg_star" => $num_avgStar,
            "total" => $total,
        ];

        return response()->json($response, 200);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function listReviews(Request $request)
    {
        $reviews = [];
        $datas = [];
        $total = 0;

        if ($request->has('page')) {
            $rpp = 1;
            if ($request->has('rpp')) {
                $rpp = (int) $request->get('rpp');
            } 

            if ($request->has('filter')) {
                $filter = $request->get('filter');
                if ($filter === '5') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('stars', 5)->paginate($rpp);
                } elseif ($filter === '4') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('stars', 4)->paginate($rpp);
                } elseif ($filter === '3') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('stars', 3)->paginate($rpp);
                } elseif ($filter === '2') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('stars', 2)->paginate($rpp);
                } elseif ($filter === '1') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('stars', 1)->paginate($rpp);
                } elseif ($filter === 'has_review') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('has_review', true)->paginate($rpp);
                } elseif ($filter === 'has_media') {
                    $reviews = Review::where('product_id', $request->get('product_id'))->where('has_media', true)->paginate($rpp);
                }
            } else {
                $reviews = Review::where('product_id', $request->get('product_id'))->paginate($rpp);
            }
            $total = $reviews->total();
        }

        foreach ($reviews as $review) {
            $size = Size::where('id', $review->size_id)->first();
            $color = Color::where('id', $size->color_id)->first();
            $user = User::where('id', $review->user_id)->first();
            $classify = "$color->color, $size->size";

            $medias = [];
            $reviewMedias = ReviewMedia::where('review_id', $review->id)->get();
            foreach ($reviewMedias as $reviewMedia) {
                $media = [
                    "id" => $reviewMedia->id,
                    "url" => $reviewMedia->url,
                    "type" => $reviewMedia->type,
                ];

                $medias[] = $media;
            }

            $data = [
                "id" => $review->id,
                "stars" => $review->stars,
                "correct_description" => $review->correct_description,
                "review_color" => $review->review_color,
                "review_material" => $review->review_material,
                "content" => $review->content,
                "like" => $review->like,
                "has_like" => $review->has_like,
                "has_review" => $review->has_review,
                "has_media" => $review->has_media,
                "status" => $review->status,
                "show_name" => $review->show_name,
                "created_at" => $review->created_at,
                "classify" => $classify,
                "user_name" => $user->name,
                "avatar" => "/storage/reviews/images/NSDJDBFSABIOB1000.jpg",
                "medias" => $medias,
            ];
            
            $datas[] = $data;
        }

        $response = [
            "total" => $total,
            "reviews" => $datas,
        ];
        return response()->json($response, 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'stars' => 'integer|max:5',
            'correct_description' => 'nullable|string|max:255',
            'review_color' => 'nullable|string|max:255',
            'review_material' => 'nullable|string|max:255',
            'content' => 'nullable|string|max:255',
        ];

        $message = [
            'stars.max' => 'Số sao vượt quá 5',
            'correct_description.max' => 'Trường Đúng với mô tả quá dài (< 255 kí tự)',
            'review_color.max' => 'Trường Màu sắc quá dài (< 255 kí tự)',
            'review_material.max' => 'Trường Chất liệu quá dài (< 255 kí tự)',
            'content.max' => 'Trường Nội dung quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);

        if ($validate->fails()) {
            return redirect('/messages')->with('messages', $validate->errors()->first());
        }

        $size = Size::where('id', $request->size_id)->first();
        $color = Color::where('id', $size->color_id)->first();
        $product = Product::where('id', $color->product_id)->first();

        // Nếu có 3 trường correct_description, review_color, review_material, content thì 
        // định xác định là đánh giá này có nội dung bình luận (has_review = true)
        $request->merge([
            'has_review' => false,
            'has_media' => false,
            'has_like' => false,
        ]);
        if (
            $request->correct_description !== null 
            || $request->review_color !== null
            || $request->review_material !== null 
            || $request->content !== null
        ) {
            $request->merge([
                'has_review' => true
            ]);
        }

        if ($request->hasFile('review_images') || $request->hasFile('review_videos')) {
            $request->merge([
                'has_media' => true
            ]);
        }

        $reviewCode = Str::random(20);

        Review::create([
            'review_code' => $reviewCode,
            'stars' => $request->stars,
            'correct_description' => $request->correct_description,
            'review_color' => $request->review_color,
            'review_material' => $request->review_material,
            'content' => $request->content,
            'has_review' => $request->has_review,
            'has_media' => $request->has_media,
            'has_like' => $request->has_like,
            'size_id' => $request->size_id,
            'user_id' => Auth::user()->id,
            'product_id' => $product->id,
        ]);

        $review = Review::where('review_code', $reviewCode)->first();

        if ($request->hasFile('review_images') || $request->hasFile('review_videos')) {
            $images = [];
            $videos = [];
            if ($request->hasFile('review_images')) {
                $images = $request->file('review_images') ? $request->file('review_images') : [];
            }
            if ($request->hasFile('review_videos')) {
                $videos = $request->file('review_videos') ? $request->file('review_videos') : [];
            }
            $medias = array_merge($images, $videos);

            foreach ($medias as $media) {
                if (Str::startsWith($media->getMimeType(), 'image')) {
                    $path = $media->store('reviews/images', 'public');
                    $url = "/storage/$path";
                    ReviewMedia::create([
                        'url' => $url,
                        'type' => 1,
                        'review_id' => $review->id,
                    ]);
                } else if (Str::startsWith($media->getMimeType(), 'video')) {
                    $path = $media->store('reviews/videos', 'public');
                    $url = "/storage/$path";
                    ReviewMedia::create([
                        'url' => $url,
                        'type' => 2,
                        'review_id' => $review->id,
                    ]);
                }
            }
        }

        return redirect('/messages')->with('success', "Đánh giá thành công!");

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function destroy(Review $review)
    {
        //
    }
}