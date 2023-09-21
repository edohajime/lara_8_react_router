<?php

namespace App\Http\Controllers;

use App\Models\ColorSize;
use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use App\Models\Color;
use App\Models\Size;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        $products = Product::paginate(15);

        foreach ($products as $product) {
            $results = [];
            $productImages = ProductImage::where('product_id', $product->id)->get();
            foreach ($productImages as $productImage) {
                $results[] = ['url' => $productImage->url];
            }
            $product->product_images = $results;
        }


        // $data = $products->data;
        // dd($data);

        return response()->json($products, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $uniqueColors = [];
        $uniqueSizes = [];

        // dd($request->all());

        $colors = $this->filter($request->all(), 'color');

        $sizes = $this->filter($request->all(), 'size');


        // Kiểm tra xem các mảng nhập có bị để trống ko?
        if (in_array(null, $colors)) {
            $data = [
                'status' => false,
                'messages' => 'Không được để trống color',
            ];
            return response()->json($data, 200);
        }
        if (in_array(null, $sizes)) {
            $data = [
                'status' => false,
                'messages' => 'Không được để trống size',
            ];
            return response()->json($data, 200);
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

        try {
            Product::create([
                'name' => $request->name,
                'code' => $request->code,
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
                        $url = Storage::url($path);
                        ProductImage::create([
                            'url' => $url,
                            'product_id' => $product->id,
                        ]);
                    } else if (Str::startsWith($media->getMimeType(), 'video')) {
                        $path = $media->store('products/videos', 'public');
                        $url = Storage::url($path);
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

            // Chuẩn bị tạo trước mã hàng hóa SKU
            $rltColors = Color::where('product_id', $product->id)->get();
            $rltSizes = Size::where('product_id', $product->id)->get();
            foreach ($rltColors as $rltColor) {
                foreach ($rltSizes as $rltSize) {
                    ColorSize::create([
                        'sku' => '',
                        'quantity' => 0,
                        'color_id' => $rltColor->id,
                        'size_id' => $rltSize->id,
                    ]);
                }
            }

            // $path = $request->file('myfile')->store('myfiles');
            // $path = $request->file('myfile')->store('public/images/products');
            $data = [
                'status' => true,
                'messages' => 'Thêm mới sản phẩm thành công!',
            ];

            return response()->json($data, 200);
        } catch (\Throwable $th) {
            $data = [
                'status' => false,
                'messages' => $th->getMessage(),
            ];
            return response()->json($data, 200);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // Lấy dữ liệu hình ảnh của sản phẩm
        $results = [];
        $productImages = ProductImage::where('product_id', $product->id)->get();
        foreach ($productImages as $productImage) {
            $results[] = ['url' => $productImage->url];
        }
        $product->product_images = $results;

        // Lấy colors sản phẩm
        $results = [];
        $colors = Color::where('product_id', $product->id)->get();
        foreach ($colors as $color) {
            $results[] = ['id' => $color->id, 'color' => $color->color];
        }
        $product->colors = $results;
        $product->total_colors = count($results);

        // Lấy sizes sản phẩm
        $results = [];
        $sizes = Size::where('product_id', $product->id)->get();
        foreach ($sizes as $size) {
            $results[] = ['id' => $size->id, 'size' => $size->size];
        }
        $product->sizes = $results;
        $product->total_sizes = count($results);

        // Lấy list color sizes sẵn có trong kho
        $results = [];
        $colorSizes = ColorSize::listColorSizesOfProduct($product->id);
        // Lấy danh sách mảng id colors của product
        $colorIds = Color::listIdOfProduct($product->id);
        // Lấy danh sách mảng id sizes của product
        $sizeIds = Size::listIdOfProduct($product->id);

        // dd($colorIds);

        foreach ($colorSizes as $colorSize) {
            // Dữ liệu color sizes sẽ được xuất ra trên front-end dưới dạng mảng 2D
            // Row là color, Col là size

            // Tìm vị trí $row của $colorSize->color_id trong mảng $colorIds
            $row = array_search($colorSize->color_id, $colorIds);
            // Tìm vị trí $col của $colorSize->size_id trong mảng $sizeIds
            $col = array_search($colorSize->size_id, $sizeIds);

            // Vị trí $row và $col ở trên sẽ trỏ tới đúng vị trí ô chứa dữ liệu quantity
            // của color, size của mảng hai chiều colorSizes trên frontend 

            // dd($row, $col);
            $colorSize->row = $row;
            $colorSize->col = $col;
        }
        $product->color_sizes = $colorSizes;


        return response()->json($product, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $uniqueColors = [];
        $uniqueSizes = [];


        // Biến dùng để lưu trữ color vừa mới cập nhật dùng cho việc lưu trữ SKU
        $updateColors = [];
        // Biến dùng để lưu trữ size vừa mới cập nhật dùng cho việc lưu trữ SKU
        $updateSizes = [];

        // dd(Color::find(3));
        // dd($request->all());

        $colors = $this->filter($request->all(), 'color');

        $sizes = $this->filter($request->all(), 'size');

        // Kiểm tra xem các mảng nhập có bị để trống ko?
        if (in_array(null, $colors)) {
            $data = [
                'status' => false,
                'messages' => 'Không được để trống color',
            ];
            return response()->json($data, 200);
        }
        if (in_array(null, $sizes)) {
            $data = [
                'status' => false,
                'messages' => 'Không được để trống size',
            ];
            return response()->json($data, 200);
        }

        $rules = [
            'name' => 'required|string|max:255',
            'price' => 'required|integer|min:0',
            'sale' => 'nullable|integer|min:0',
            'description' => 'string|nullable',
            'short_description' => 'string|max:255|nullable',
        ];

        $message = [
            'name.required' => 'Sản phẩm cần có tên sản phẩm',
            'name.max' => 'Tên sản phẩm quá dài (< 255 kí tự)',
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

        // Cập nhật sản phẩm
        try {
            $product->name = $request->name;
            $product->price = $request->price;
            $product->sale = $request->sale;
            $product->description = $request->description;
            $product->short_description = $request->short_description;

            $product->save();

            // Cập nhật hình ảnh sản phẩm
            // Xóa hỉnh ảnh sản phẩm
            $productImages = ProductImage::where('product_id', $product->id);
            $list = $productImages->get();
            foreach ($list as $image) {
                // Nếu bạn muốn sử dụng hàm Storage::delete() để xóa tệp tin, bạn cần truyền vào 
                // đường dẫn đến tệp tin cần xóa. Đường dẫn này phải bắt đầu bằng public/ để chỉ 
                // ra rằng tệp tin cần xóa nằm trong thư mục storage/app/public
                $path = str_replace('storage', 'public', $image->url);
                Storage::delete($path);
            }
            $productImages->delete();
            if ($request->hasFile('images')) {
                $images = [];
                if ($request->hasFile('images')) {
                    $images = $request->file('images') ? $request->file('images') : [];
                }
                $medias = $images;

                foreach ($medias as $media) {
                    if (Str::startsWith($media->getMimeType(), 'image')) {
                        $path = $media->store('products/images', 'public');
                        $url = Storage::url($path);
                        ProductImage::create([
                            'url' => $url,
                            'product_id' => $product->id,
                        ]);
                    } else if (Str::startsWith($media->getMimeType(), 'video')) {
                        $path = $media->store('products/videos', 'public');
                        $url = Storage::url($path);
                        ProductImage::create([
                            'url' => $url,
                            'product_id' => $product->id,
                        ]);
                    }
                }
            }

            // dd('success');

            // Cập nhật color
            // Trước khi cập nhật thì cần xóa mềm color trước
            Color::where('product_id', $product->id)->delete();
            foreach ($colors as $color) {
                // Xem color đã lưu trước đó chưa, withTrash() dùng để lấy cả những bản ghi đã xóa mềm
                $colorQuery = Color::withTrashed()->where('color', $color)->first();
                // dd($colorQuery);

                // Nếu chưa lưu
                if (!$colorQuery) {
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

                        // Lưu vào updateColors
                        $updateColors[] = $color;
                    }
                } else {
                    // Nếu đã lưu thì restore lại color
                    Color::withTrashed()->where('color', $color)->restore();
                }

            }

            // Lưu size của sản phẩm
            // Trước khi cập nhật thì cần xóa mềm color trước
            Size::where('product_id', $product->id)->delete();
            foreach ($sizes as $size) {
                // Xem color đã lưu trước đó chưa, withTrash() dùng để lấy cả những bản ghi đã xóa mềm
                $sizeQuery = Size::withTrashed()->where('size', $size)->first();
                // Nếu chưa lưu
                if (!$sizeQuery) {
                    if (!in_array($size, $uniqueSizes)) {
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

                        // Lưu vào updateSizes
                        $updateSizes[] = $size;
                    }
                } else {
                    // Nếu đã lưu thì restore lại size
                    Size::withTrashed()->where('size', $size)->restore();
                }
            }

            // Lưu trữ SKU
            // Chuẩn bị cập nhật lại trước (mã hàng hóa SKU)
            $rltColors = Color::where('product_id', $product->id)->get();
            $rltSizes = Size::where('product_id', $product->id)->get();
            foreach ($rltColors as $rltColor) {
                foreach ($rltSizes as $rltSize) {
                    // Nếu color hoặc size vừa mới lưu thì tiếp tục thêm vào database 
                    if (
                        in_array($rltColor->color, $updateColors) ||
                        in_array($rltSize->size, $updateSizes)
                    ) {
                        ColorSize::create([
                            'sku' => null,
                            'quantity' => 0,
                            'color_id' => $rltColor->id,
                            'size_id' => $rltSize->id,
                        ]);
                    }
                }
            }

            $data = [
                'status' => true,
                'messages' => 'Cập nhật sản phẩm thành công!',
            ];
        } catch (\Throwable $th) {
            $data = [
                'status' => false,
                'messages' => $th->getMessage(),
            ];
        }
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