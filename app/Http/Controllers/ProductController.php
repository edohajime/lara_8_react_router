<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        $data = [
            'products' => Product::all()
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
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:' . Product::class,
            'total_quantity' => 'required|integer|min:0',
            'price' => 'required|integer|min:0',
            'sale' => 'nullable|integer|min:0',
            'description' => 'string|nullable',
            'short_description' => 'string|max:255|nullable',
        ];

        $message = [
            'name.required' => 'Sản phẩm cần có tên sản phẩm',
            'name.max' => 'Tên sản phẩm quá dài (< 255 kí tự)',
            'code.required' => 'Sản phẩm cần có mã sản phẩm',
            'code.max' => 'Mã sản phẩm quá dài (< 255 kí tự)',
            'code.unique' => 'Mã sản phẩm đã tồn tại',
            'total_quantity.required' => 'Bạn phải nhập số lượng sản phẩm hiện có',
            'total_quantity.integer' => 'Số lượng sản phẩm phải là số nguyên',
            'total_quantity.min' => 'Số lượng sản phẩm không được âm',
            'price.required' => 'Bạn phải nhập giá sản phẩm hiện có',
            'price.integer' => 'Giá sản phẩm phải là số nguyên',
            'price.min' => 'Giá sản phẩm không được âm',
            'sale.integer' => 'Ưu đãi giảm giá sản phẩm phải là số nguyên',
            'sale.min' => 'Ưu đãi giảm giá sản phẩm không được âm',
            'short_description.max' => 'Mô tả ngắn quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);

        if ($validate->fails()) {
            $data = [
                'status' => false,
                'message' => $validate->errors()->first(),
            ];
            return response()->json($data, 200);
        }

        $product = Product::create([
            'name' => $request->name,
            'code' => $request->code,
            'total_quantity' => $request->total_quantity,
            'price' => $request->price,
            'sale' => $request->sale,
            'description' => $request->description,
            'short_description' => $request->short_description,
        ]);

        $data = [
            'status' => true,
            'product' => $product,
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $data = [
            'status' => true,
            'product' => $product
        ];
        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $id = $request->query('id');

        $product = Product::all()->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy sản phẩm'
            ], 200);
        }

        $rules = [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'total_quantity' => 'required|integer|min:0',
            'price' => 'required|integer|min:0',
            'sale' => 'nullable|integer|min:0',
            'description' => 'string|nullable',
            'short_description' => 'string|max:255|nullable',
        ];

        $message = [
            'name.required' => 'Sản phẩm cần có tên sản phẩm',
            'name.max' => 'Tên sản phẩm quá dài (< 255 kí tự)',
            'code.required' => 'Sản phẩm cần có mã sản phẩm',
            'code.max' => 'Mã sản phẩm quá dài (< 255 kí tự)',
            'total_quantity.required' => 'Bạn phải nhập số lượng sản phẩm hiện có',
            'total_quantity.integer' => 'Số lượng sản phẩm phải là số nguyên',
            'total_quantity.min' => 'Số lượng sản phẩm không được âm',
            'price.required' => 'Bạn phải nhập giá sản phẩm hiện có',
            'price.integer' => 'Giá sản phẩm phải là số nguyên',
            'price.min' => 'Giá sản phẩm không được âm',
            'sale.integer' => 'Ưu đãi giảm giá sản phẩm phải là số nguyên',
            'sale.min' => 'Ưu đãi giảm giá sản phẩm không được âm',
            'short_description.max' => 'Mô tả ngắn quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);

        if ($validate->fails()) {
            $data = [
                'status' => false,
                'message' => $validate->errors()->first(),
            ];
            return response()->json($data, 200);
        }

        $product->update([
            'name' => $request->name,
            'code' => $request->code,
            'total_quantity' => $request->total_quantity,
            'price' => $request->price,
            'sale' => $request->sale,
            'description' => $request->description,
            'short_description' => $request->short_description,
        ]);

        $data = [
            'status' => true,
            'product' => $product,
        ];

        return response()->json($data, 200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product)
    {
        $deleted = Product::where('id', $product->id)->delete();
        if ($deleted) {
            return response()->json([
                'status' => true,
                'product' => $product
            ]);
        }
    }



}