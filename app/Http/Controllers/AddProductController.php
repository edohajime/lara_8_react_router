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

        $colors = $this->filter($request->all(), 'color');

        $sizes = $this->filter($request->all(), 'size');

        $quantities = $this->filter($request->all(), 'quantity');

        

        // Kiểm tra xem các mảng nhập có bị để trống ko?
        if (in_array(null, $colors)) {
            return redirect('/messages')->with('messages', "Không được để trống color");
        }
        if (in_array(null, $sizes)) {
            return redirect('/messages')->with('messages', "Không được để trống size");
        }
        if (in_array(null, $quantities)) {
            return redirect('/messages')->with('messages', "Không được để trống quantity");
        }

        // Kiểm tra có cặp color - size trùng nhau không?
        $uniques = [];
        $length = count($colors);
        for ($i = 0; $i < $length; $i++) {
            $key = "$colors[$i] - $sizes[$i]";
            if (in_array($key, $uniques)) {
                return redirect('/messages')->with('messages', "Xuất hiện cặp color - size trùng nhau ($key)");
            }

            $uniques[] = $key;
        }

        // Lấy tổng số lượng của sản phẩm hiện có và thêm vào request
        $totalQuantity = 0;
        foreach ($quantities as $quantity) {
            $totalQuantity += $quantity;
        }
        $request->merge([
            'total_quantity' => $totalQuantity
        ]);

        
        $rules = [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:' . Product::class,
            'total_quantity' => 'required|integer|min:0',
            'price' => 'required|integer|min:0',
            'sale' => 'nullable|integer|min:0',
            'description' => 'string|nullable',
            'short_description' => 'string|max:255|nullable',
            'color' => 'string|max:255',
            'size' => 'string|max:20',
            'quantity' => 'integer|min:0',

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
            'color.max' => 'Tên màu quá dài (< 255 kí tự)',
            'size.max' => 'Tên size quá dài (< 20 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);

        if ($validate->fails()) {
            return redirect('/messages')->with('messages', $validate->errors()->first());
        }

        Product::create([
            'name' => $request->name,
            'code' => $request->code,
            'total_quantity' => $request->total_quantity,
            'price' => $request->price,
            'sale' => $request->sale,
            'description' => $request->description,
            'short_description' => $request->short_description,
        ]);

        // Lấy product
        $product = Product::where('code', $request->code)->first();
        
        // Lưu color & size của sản phẩm
        $length = count($colors);
        for ($i = 0; $i < $length; $i++) {  
            // Nếu đã ở trong uniqueColors thì không được lưu tiếp color
            if (! in_array($colors[$i], $uniqueColors)) {
                // Sinh ngẫu nhiên color code
                $colorCode = Str::random(20);
                
                // Lưu color
                Color::create([
                    'color' => $colors[$i],
                    'color_code' => $colorCode,
                    'product_id' => $product->id,
                ]);
                
                // Thêm vào uniqueColors nếu không có
                $uniqueColors[] = $colors[$i];
            }

            // Đối với trường hợp của size và quantity thì không cần phải là duy nhất nữa, 
            // do chỉ cần color là duy nhất và cặp color - size là duy nhất là thỏa mãn điều
            // kiện mỗi color không có nhiều size giống nhau.

            // Sinh ngẫu nhiên size code
            $sizeCode = Str::random(20);
            
            // Truy xuất thông tin của color hiện tại
            $color = Color::where('color_code', $colorCode)->first();

            // Lưu size
            Size::create([
                'size' => $sizes[$i],
                'size_code' => $sizeCode,
                'quantity' => $quantities[$i],
                'color_id' => $color->id,
            ]);
            
        } // end Lưu color & size của sản phẩm

        // $path = $request->file('myfile')->store('myfiles');
        // $path = $request->file('myfile')->store('public/images/products');

        // Lưu hình ảnh sản phẩm
        if ($request->hasFile('images')) {
            $images = $request->file('images');

            foreach ($images as $image) {
                $path = $image->store('images/products', 'public');
                $url = "/storage/$path";
    
                ProductImage::create([
                    'url' => $url,
                    'product_id' => $product->id,
                ]);
            }
            
        } // end Lưu hình ảnh sản phẩm

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