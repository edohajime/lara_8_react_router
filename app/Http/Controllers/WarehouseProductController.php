<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ColorSize;
use App\Models\Warehouse;
use App\Models\WarehouseProduct;
use Illuminate\Http\Request;

class WarehouseProductController extends Controller
{
    public function show(Request $request)
    {
        $fail = false;

        $warehouse = Warehouse::where('name', $request->warehouse)->first();
        $colorSize = ColorSize::where('sku', $request->sku)->first();
        if ($colorSize) {
            $warehousePd = $warehouse->warehouseproducts()->where('sku', $request->sku)->first();
            $specifics = [
                $colorSize->color->product->name,
                $colorSize->color->color,
                $colorSize->size->size,
            ];
            $nameSpecific = implode(', ', $specifics);
            // dd($warehousePd);
            if ($warehousePd) {
                $result = [
                    'sku' => $warehousePd->sku,
                    'name_specific' => $nameSpecific,
                    'quantity' => $warehousePd->quantity,
                    'warehouse_id' => $warehouse->id,
                ];

                $data = [
                    'status' => true,
                    'warehouse_product' => $result,
                ];

                return response()->json($data, 200);
            } else {
                $fail = true;
            }
        } else {
            $fail = true;
        }

        if ($fail) {
            $result = [
                'sku' => $request->sku,
                'name_specific' => '',
                'quantity' => 0,
                'warehouse_id' => $warehouse->id,
            ];

            $data = [
                'status' => false,
                'warehouse_product' => $result,
            ];

            return response()->json($data, 200);
        }
    }
}