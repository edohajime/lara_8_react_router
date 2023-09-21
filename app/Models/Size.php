<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Size extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'size',
        'size_code',
        'product_id'
    ];

    public static function listIdOfProduct($id) {
        $sizeList = [];
        $sizes = DB::table('sizes')->select('id')->where('product_id', $id)->get();
        foreach ($sizes as $size) {
            $sizeList[] = $size->id;
        }
        return $sizeList;
    }

    public function colorsizes(): HasMany
    {
        return $this->hasMany(ColorSize::class, 'size_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
