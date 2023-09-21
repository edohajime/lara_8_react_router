<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'person_in_charge',
        'position',
        'completed',
        'status',
        'warehouse_id',
        'staff_id',
    ];
}
