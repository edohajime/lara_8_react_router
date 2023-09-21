<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'unit',
        'quantity',
        'real_quantity',
        'price',
        'quality',
        'warehouse_inventorie_id'
    ];
}
