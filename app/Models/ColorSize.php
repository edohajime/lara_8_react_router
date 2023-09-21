<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class ColorSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'quantity',
        'color_id',
        'size_id',
    ];

    public static function listOfProduct($id) {
        $colors = DB::table('colors')->select('id')->where('product_id', $id);
        return DB::table('color_sizes')->select('id')->whereIn('color_id', $colors);
    }

    public static function listColorSizesOfProduct($id) {
        $colors = DB::table('colors')->select('id')->where('product_id', $id);
        return DB::table('color_sizes')->whereIn('color_id', $colors)->orderBy('color_id')->get();
    }

    public function color(): BelongsTo
    {
        return $this->belongsTo(Color::class, 'color_id');
    }

    public function size(): BelongsTo
    {
        return $this->belongsTo(Size::class, 'size_id');
    }

}
