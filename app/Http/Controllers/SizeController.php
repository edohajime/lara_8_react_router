<?php

namespace App\Http\Controllers;

use App\Models\Size;
use App\Models\Color;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    /**
     * Display a listing size of the color.
     */
    public function listSizesOfColor(Color $color)
    {
        $sizes = Size::where('color_id', $color->id)->get();
        return response()->json([
            'color_id' => $color->id,
            'sizes' => $sizes,
        ], 200);
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
    public function store(Request $request, Color $color)
    {
        $rules = [
            'size' => 'required|string|max:20|unique:'.Size::class,
            'quantity' => 'required|integer|min:0',
        ];

        $message = [
            'size.required' => 'Trường size là bắt buộc',
            'size.max' => 'Tên size quá dài (< 20 kí tự)',
            'size.unique' => 'Size này đã tồn tại',
            'quantity.required' => 'Trường quantity là bắt buộc',
            'quantity.integer' => 'Quantity phải là số nguyên',
            'quantity.min' => 'Quantity không phải là số âm',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()) {
            $data = [
                'status' => true,
                'message' => $validate->errors()->first(),
            ];

            return response()->json($data, 200);
        }

        $size = Size::create([
            'size' => $request->size,
            'quantity' => $request->quantity,
            'color_id' => $color->id,
        ]);

        $data = [
            'status' => true,
            'size' => $size,
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Size $size)
    {
        return response()->json([
            'status' => true,
            'size' => $size,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Size $size)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Size $size)
    {
        $rules = [
            'size' => 'required|string|max:20',
            'quantity' => 'required|integer|min:0',
        ];

        $message = [
            'size.required' => 'Trường size là bắt buộc',
            'size.max' => 'Tên size quá dài (< 20 kí tự)',
            'quantity.required' => 'Trường quantity là bắt buộc',
            'quantity.integer' => 'Quantity phải là số nguyên',
            'quantity.min' => 'Quantity không phải là số âm',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()) {
            $data = [
                'status' => true,
                'message' => $validate->errors()->first(),
            ];

            return response()->json($data, 200);
        }

        $size->update([
            'size' => $request->size,
            'quantity' => $request->quantity,
        ]);

        $data = [
            'status' => true,
            'size' => $size,
        ];

        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Size $size)
    {
        $deleted = Size::where('id', $size->id)->delete();

        return response()->json([
            'status' => true,
            'deleted' => $deleted,
            'size' => $size
        ], 200);
    }
}
