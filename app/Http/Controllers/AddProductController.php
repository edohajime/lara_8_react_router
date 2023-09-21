<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AddProductController extends Controller
{
    protected $productController;
    protected $colorController;
    protected $sizeController;
    public function __construct(
        ProductController $productController,
        ColorController $colorController,
        SizeController $sizeController
    ) {
        $this->productController = $productController;
        $this->colorController = $colorController;
        $this->sizeController = $sizeController;
    }
    public function addProduct(Request $request)
    {
        $uniqueColors = [];
        $uniqueSizes = [];

        // dd($request->all());

        $colors = $this->filter($request->all(), 'color');

        $sizes = $this->filter($request->all(), 'size');

        // $quantities = $this->filter($request->all(), 'quantity');



        // Kiểm tra xem các mảng nhập có bị để trống ko?
        if (in_array(null, $colors)) {
            return redirect('/messages')->with('messages', "Không được để trống color");
        }
        if (in_array(null, $sizes)) {
            return redirect('/messages')->with('messages', "Không được để trống size");
        }


        $rules = [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:' . Product::class,
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
            // 'total_quantity.required' => 'Bạn phải nhập số lượng sản phẩm hiện có',
            // 'total_quantity.integer' => 'Số lượng sản phẩm phải là số nguyên',
            // 'total_quantity.min' => 'Số lượng sản phẩm không được âm',
            'price.required' => 'Bạn phải nhập giá sản phẩm hiện có',
            'price.integer' => 'Giá sản phẩm phải là số nguyên',
            'price.min' => 'Giá sản phẩm không được âm',
            'sale.integer' => 'Ưu đãi giảm giá sản phẩm phải là số nguyên',
            'sale.min' => 'Ưu đãi giảm giá sản phẩm không được âm',
            'short_description.max' => 'Mô tả ngắn quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);

        if ($validate->fails()) {
            return redirect('/messages')->with('messages', $validate->errors()->first());
        }

        Product::create([
            'name' => $request->name,
            'code' => $request->code,
            // 'total_quantity' => $request->total_quantity,
            'price' => $request->price,
            'sale' => $request->sale,
            'description' => $request->description,
            'short_description' => $request->short_description,
        ]);

        // Lấy product
        $product = Product::where('code', $request->code)->first();

        // Lưu hình ảnh sản phẩm
        if ($request->hasFile('images')) {
            $images = [];
            if ($request->hasFile('images')) {
                $images = $request->file('images') ? $request->file('images') : [];
            }
            $medias = $images;

            foreach ($medias as $media) {
                if (Str::startsWith($media->getMimeType(), 'image')) {
                    $path = $media->store('products/images', 'public');
                    $url = "/storage/$path";
                    ProductImage::create([
                        'url' => $url,
                        'product_id' => $product->id,
                    ]);
                } else if (Str::startsWith($media->getMimeType(), 'video')) {
                    $path = $media->store('products/videos', 'public');
                    $url = "/storage/$path";
                    ProductImage::create([
                        'url' => $url,
                        'product_id' => $product->id,
                    ]);
                }
            }
        }

        // dd('success');

        // Lưu color 
        foreach ($colors as $color) {
            if (!in_array($color, $uniqueColors)) {
                // Sinh ngẫu nhiên color code
                $colorCode = Str::random(20);

                // Lưu color
                Color::create([
                    'color' => $color,
                    'color_code' => $colorCode,
                    'product_id' => $product->id,
                ]);

                // Thêm vào uniqueColors nếu không có
                $uniqueColors[] = $color;
            }

        }

        // Lưu size của sản phẩm
        foreach ($sizes as $size) {
            if (!in_array($color, $uniqueSizes)) {
                // Sinh ngẫu nhiên color code
                $sizeCode = Str::random(20);

                // Lưu color
                Size::create([
                    'size' => $size,
                    'size_code' => $sizeCode,
                    'product_id' => $product->id,
                ]);

                // Thêm vào uniqueColors nếu không có
                $uniqueSizes[] = $size;
            }

        }

        // $path = $request->file('myfile')->store('myfiles');
        // $path = $request->file('myfile')->store('public/images/products');

        return redirect('/messages')->with('success', "Thêm sản phẩm thành công!");

    }

    public function filter($arrays, $reg)
    {
        $filters = [];
        foreach ($arrays as $key => $value) {
            if (preg_match('/^' . $reg . '\d+$/', $key)) {
                $filters[] = $value;
            }
        }
        return $filters;
    }
}