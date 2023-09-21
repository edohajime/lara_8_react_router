<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warehouse extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'address',
    ];

    public function warehouseproducts(): HasMany
    {
        return $this->hasMany(WarehouseProduct::class, 'warehouse_id');
    }

    public function warehouseinventories(): HasMany
    {
        return $this->hasMany(WarehouseInventory::class, 'warehouse_id');
    }

    public function warehouseios(): HasMany
    {
        return $this->hasMany(WarehouseIO::class, 'warehouse_id');
    }
}
