<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'total_quantity',
        'price',
        'sale',
        'description',
        'short_description',
        'status'
    ];
}
