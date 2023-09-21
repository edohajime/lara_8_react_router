<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\WarehouseProduct;
use Illuminate\Http\Request;

class WarehouseProductController extends Controller
{
    public function show(WarehouseProduct $warehouse)
    {
        $result = [
            'name' => $warehouse->name,
            'location' => $warehouse->location,
            'address' => $warehouse->address,
        ];

        return response()->json($result, 200);
    }
}