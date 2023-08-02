<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    /**
     * Display a listing images of the product.
     */
    public function listImagesOfProduct(Product $product)
    {
        $productImages = ProductImage::where('product_id', $product->id)->get();
        $data = [
            'product_id' => $product->id,
            'product_images' => $productImages
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
            'url' => 'required|string|max:255|unique:' . ProductImage::class
        ];

        $message = [
            'url.required' => 'Trường hình ảnh là bắt buộc',
            'url.max' => 'Đường dẫn hình ảnh quá dài (< 255 kí tự)',
            'url.unique' => 'Đường dẫn hình ảnh đã tồn tại',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()) {
            $data = [
                'status' => false,
                'message' => $validate->errors()->first()
            ];

            return response()->json($data, 200);
        }

        $image = ProductImage::create([
            'url' => $request->url,
            'product_id' => $product->id
        ]);

        $data = [
            'status' => true,
            'product_image' => $image
        ];

        return response()->json($data, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductImage $productImage)
    {
        $data = [
            'status' => true,
            'product' => $productImage
        ];

        return response()->json($data, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductImage $productImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductImage $productImage)
    {
        $rules = [
            'url' => 'required|string|max:255'
        ];

        $message = [
            'url.required' => 'Trường hình ảnh là bắt buộc',
            'url.max' => 'Đường dẫn hình ảnh quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()) {
            $data = [
                'status' => false,
                'message' => $validate->errors()->first()
            ];

            return response()->json($data, 200);
        }

        $productImage->update([
            'url' => $request->url,
            'product_id' => $productImage->product_id
        ]);

        $data = [
            'status' => true,
            'product_image' => $productImage
        ];

        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductImage $productImage)
    {
        $deleted = ProductImage::where('id', $productImage->id)->delete();

        return response()->json([
            'status' => true,
            'deleted' => $deleted,
            'product_image' => $productImage
        ]);
    }
}