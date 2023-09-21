<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Color;
use App\Models\ColorSize;
use App\Models\Product;
use App\Models\Size;

// use Illuminate\Http\Request;

class SKUController extends Controller
{
    public function list()
    {
        try {
            $results = [];
            $colorSizes = ColorSize::paginate(15);
            foreach ($colorSizes as $colorSize) {
                $color = Color::where('id', $colorSize->color_id)->first();
                $size = Size::where('id', $colorSize->size_id)->first();
                $product = Product::where('id', $size->product_id)->first();
                $result = [
                    'sku' => $colorSize->sku,
                    'prodName' => $product->name,
                    'quantity' => $colorSize->quantity,
                    'color' => $color->color,
                    'size' => $size->size,
                ];

                $results[] = $result;
            }

            $data = [
                'status' => true,
                'skus' => $results,
            ];
        } catch (\Throwable $th) {
            $data = [
                'status' => false,
                'messages' => $th->getMessage(),
            ];
        }

        return response()->json($data, 200);
        // dd($colorSizes);
    }
}