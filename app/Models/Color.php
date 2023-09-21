<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Color extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'color',
        'color_code',
        'product_id',
    ];

    public static function listIdOfProduct($id) {
        $colorList = [];
        $colors = DB::table('colors')->select('id')->where('product_id', $id)->get();
        foreach ($colors as $color) {
            $colorList[] = $color->id;
        }
        return $colorList;
    }

    public function colorsizes(): HasMany
    {
        return $this->hasMany(ColorSize::class, 'color_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
