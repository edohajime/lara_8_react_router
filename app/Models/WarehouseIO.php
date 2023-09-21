<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseIO extends Model
{
    use HasFactory;

    protected $table = 'warehouse_ios';

    protected $fillable = [
        'type',
        'code',
        'requestor',
        'requestor_address',
        'person_in_charge',
        'decision',
        'cause',
        'completed',
        'warehouse_id',
        'staff_id',
    ];

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class, 'warehouse_io_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'warehouse_id');
    }
}