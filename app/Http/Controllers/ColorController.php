<?php

namespace App\Http\Controllers;

use App\Models\Color;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ColorController extends Controller
{
    /**
     * Display a listing colors of the products.
     */
    public function listColorsOfProduct(Product $product)
    {
        $colors = Color::where('product_id', $product->id)->get();

        $data = [
            'product_id' => $product->id,
            'colors' => $colors,
        ];

        return response()->json($data, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product)
    {
        $rules = [
            'color' => 'required|string|max:255',
        ];

        $message = [
            'color.required' => 'Trường tên màu là bắt buộc.',
            'color.max' => 'Tên màu quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()){
            $data = [
                'status' => false,
                'message' => $validate->errors()->first(),
            ];

            return response()->json($data, 200);
        }

        $color = Color::create([
            'color' => $request->color,
            'product_id' => $product->id,
        ]);

        $data = [
            'status' => true,
            'color' => $color,
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Color $color)
    {
        return response()->json([
            'status' => true,
            'color' => $color
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Color $color)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Color $color)
    {
        $rules = [
            'color' => 'required|string|max:255',
        ];

        $message = [
            'color.required' => 'Trường tên màu là bắt buộc.',
            'color.max' => 'Tên màu quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()){
            $data = [
                'status' => false,
                'message' => $validate->errors()->first(),
            ];

            return response()->json($data, 200);
        }

        $color->update([
            'color' => $request->color,
        ]);

        $data = [
            'status' => true,
            'color' => $color,
        ];

        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
    {
        $deleted = Color::where('id', $color->id)->delete();

        return response()->json([
            'status' => true,
            'deleted' => $deleted,
            'color' => $color
        ]);
    }
}
