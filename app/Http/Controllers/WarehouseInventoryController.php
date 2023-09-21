<?php

namespace App\Http\Controllers;

use App\Models\ColorSize;
use App\Models\InventoryProduct;
use App\Models\Warehouse;
use App\Models\WarehouseInventory;
use App\Http\Controllers\Controller;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WarehouseInventoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function list()
    {
        $warehouseInventories = WarehouseInventory::paginate(15);
        $results = [];
        foreach ($warehouseInventories as $warehouseInventory) {
            $createdAt = new DateTime($warehouseInventory->created_at);
            $updatedAt = new DateTime($warehouseInventory->updated_at);
            $warehouse = Warehouse::where('id', $warehouseInventory->warehouse_id)->first();
            $result = [
                'id' => $warehouseInventory->id,
                'code' => $warehouseInventory->code,
                'type' => $warehouseInventory->type,
                'person_in_charge' => $warehouseInventory->person_in_charge,
                'position' => $warehouseInventory->position,
                'completed' => $warehouseInventory->completed,
                'status' => $warehouseInventory->status,
                'warehouse' => $warehouse->name,
                'staff_id' => $warehouseInventory->staff_id,
                'created_at' => $createdAt->format('d-m-Y'),
                'updated_at' => $updatedAt->format('d-m-Y'),
            ];

            $results[] = $result;

        }

        $data = [
            'status' => count($warehouseInventories) === 0 ? false : true,
            'warehouseInventories' => $results,
        ];

        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $names = $request->name;
        $skus = $request->sku;
        $units = $request->unit;
        $quantities = $request->quantity;
        $prices = $request->price;
        $qualities = $request->quality;

        $data = [$names, $skus, $units, $quantities, $prices, $qualities];
        $dataLabel = [
            "Tên nhãn hàng sản phẩm" => $names,
            "Mã sản phẩm" => $skus,
            "Đơn vị tính" => $units,
            "Số lượng theo chứng từ" => $quantities,
            "Đơn giá" => $prices,
            "Tình trạng" => $qualities,
        ];

        $rules = [
            'person_in_charge' => 'required|string|max:255',
            'position' => 'required|string|max:255',
        ];

        $message = [
            'person_in_charge.required' => 'Thiếu người phụ trách',
            'person_in_charge.max' => 'Tên người phụ trách quá dài (< 255 kí tự)',
            'position.required' => 'Thiếu chức vụ người phụ trách',
            'position.max' => 'Chức vụ người phụ trách quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()) {
            $data = [
                'status' => false,
                'messages' => $validate->errors()->first(),
            ];

            return response()->json($data, 200);
        }

        // Kiểm tra xem các mảng nhập sản phẩm có bị để trống ko?
        foreach ($dataLabel as $key => $value) {
            if (in_array(null, $value)) {
                $data = [
                    'status' => false,
                    'messages' => 'Không được để trống ' . $key,
                ];

                return response()->json($data, 200);
            }
        }

        // Kiểm tra SKU có tồn tại trong database không
        foreach ($skus as $sku) {
            $querySku = ColorSize::where('sku', $sku)->first();

            // Nếu không có thì ném thông báo lỗi
            if (!$querySku) {
                $data = [
                    'status' => false,
                    'messages' => 'SKU không tồn tại!',
                ];

                return response()->json($data, 200);
            }
        }

        $inventories = [];
        for ($i = 0; $i < count($data[0]); $i++) {
            // Gán dữ liệu của cột thứ $i trong mảng 2 chiều $data cho $inventories[$i]
            $inventories[] = array_column($data, $i);
        }

        $warehouseInventoryCode = Str::random(20);
        $warehouse = Warehouse::where('name', $request->warehouse)->first();

        try {
            WarehouseInventory::create([
                'code' => $warehouseInventoryCode,
                'person_in_charge' => $request->person_in_charge,
                'position' => $request->position,
                'warehouse_id' => $warehouse->id,
                'staff_id' => $request->staff_id,
            ]);

            $warehouseInventory = WarehouseInventory::where('code', $warehouseInventoryCode)->first();

            foreach ($inventories as $inventory) {
                InventoryProduct::create([
                    'name' => $inventory[0],
                    'sku' => $inventory[1],
                    'unit' => $inventory[2],
                    'quantity' => $inventory[3],
                    'price' => $inventory[4],
                    'quality' => $inventory[5],
                    'warehouse_inventorie_id' => $warehouseInventory->id,
                ]);
            }
            $data = [
                'status' => true,
                'messages' => 'Thêm mới thành công',
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
     *
     * @param  \App\Models\WarehouseInventory  $warehouseInventory
     * @return \Illuminate\Http\Response
     */
    public function show(WarehouseInventory $warehouseInventory)
    {
        $warehouse = Warehouse::where('id', $warehouseInventory->warehouse_id)->first();
        // dd($warehouseInventory->id);
        $warehouseInventory->warehouse = $warehouse->name;

        $results = [];
        $inventories = InventoryProduct::where('warehouse_inventorie_id', $warehouseInventory->id)->get();
        // dd($inventories);
        foreach ($inventories as $inventory) {
            $result = [
                'name' => $inventory->name,
                'sku' => $inventory->sku,
                'unit' => $inventory->unit,
                'quantity' => $inventory->quantity,
                'realQuantity' => $inventory->real_quantity,
                'price' => $inventory->price,
                'quality' => $inventory->quality,
            ];
            $results[] = $result;
        }
        $warehouseInventory->inventories = $results;
        // dd($warehouseInventory);

        $data = [
            'status' => true,
            'warehouseInventory' => $warehouseInventory,
        ];

        return response()->json($data, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\WarehouseInventory  $warehouseInventory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, WarehouseInventory $warehouseInventory)
    {
        // dd($request->all());
        $names = $request->name;
        $skus = $request->sku;
        $units = $request->unit;
        $quantities = $request->quantity;
        $realQuantities = $request->real_quantity;
        $prices = $request->price;
        $qualities = $request->quality;

        $data = [$names, $skus, $units, $quantities, $realQuantities, $prices, $qualities];
        $dataLabel = [
            "Tên nhãn hàng sản phẩm" => $names,
            "Mã sản phẩm" => $skus,
            "Đơn vị tính" => $units,
            "Số lượng theo chứng từ" => $quantities,
            "Số lượng thực nhập" => $realQuantities,
            "Đơn giá" => $prices,
            "Tình trạng" => $qualities,
        ];

        $rules = [
            'person_in_charge' => 'required|string|max:255',
            'position' => 'required|string|max:255',
        ];

        $message = [
            'person_in_charge.required' => 'Thiếu người phụ trách',
            'person_in_charge.max' => 'Tên người phụ trách quá dài (< 255 kí tự)',
            'position.required' => 'Thiếu chức vụ người phụ trách',
            'position.max' => 'Chức vụ người phụ trách quá dài (< 255 kí tự)',
        ];

        $validate = validator($request->all(), $rules, $message);
        if ($validate->fails()) {
            $data = [
                'status' => false,
                'messages' => $validate->errors()->first(),
            ];

            return response()->json($data, 200);
        }

        // Kiểm tra xem các mảng nhập sản phẩm có bị để trống ko?
        foreach ($dataLabel as $key => $value) {
            if (in_array(null, $value)) {
                $data = [
                    'status' => false,
                    'messages' => 'Không được để trống ' . $key,
                ];

                return response()->json($data, 200);
            }
        }

        // Kiểm tra SKU có tồn tại trong database không
        foreach ($skus as $sku) {
            $querySku = ColorSize::where('sku', $sku)->first();

            // Nếu không có thì ném thông báo lỗi
            if (!$querySku) {
                $data = [
                    'status' => false,
                    'messages' => 'SKU không tồn tại!',
                ];

                return response()->json($data, 200);
            }
        }

        $inventories = [];
        for ($i = 0; $i < count($data[0]); $i++) {
            // Gán dữ liệu của cột thứ $i trong mảng 2 chiều $data cho $inventories[$i]
            $inventories[] = array_column($data, $i);
        }

        // dd($inventories);

        $warehouse = Warehouse::where('name', $request->warehouse)->first();

        try {
            $warehouseInventory->person_in_charge = $request->person_in_charge;
            $warehouseInventory->position = $request->position;
            $warehouseInventory->warehouse_id = $warehouse->id;
            $warehouseInventory->staff_id = $request->staff_id;
            $warehouseInventory->completed = intval($request->completed);
            $warehouseInventory->save();

            $inventoryProducts = InventoryProduct::where('warehouse_inventorie_id', $warehouseInventory->id)->get();
            $editInvProds = [];
            foreach ($inventories as $inventory) {
                $existed = false;

                foreach ($inventoryProducts as $inventoryProduct) {
                    // dd($inventory[1]);
                    if ($inventory[1] === $inventoryProduct->sku) {
                        $existed = true;

                        // Thêm inventory products vào editInvProds nếu có tồn tại trong database
                        $editInvProds[] = $inventoryProduct->toArray();

                        // Không cần sửa sku, warehouse_id
                        $inventoryProduct->name = $inventory[0];
                        $inventoryProduct->unit = $inventory[2];
                        $inventoryProduct->quantity = intval($inventory[3]);
                        $inventoryProduct->real_quantity = intval($inventory[4]);
                        $inventoryProduct->price = intval($inventory[5]);
                        $inventoryProduct->quality = intval($inventory[6]);
                        $inventoryProduct->save();
                    }
                }
                // dd($inventories);

                // Nếu request inventory products không nằm trong truy vấn thì thêm
                if (!$existed) {
                    InventoryProduct::create([
                        'name' => $inventory[0],
                        'sku' => $inventory[1],
                        'unit' => $inventory[2],
                        'quantity' => $inventory[3],
                        'real_quantity' => $inventory[4],
                        'price' => $inventory[5],
                        'quality' => $inventory[6],
                        'warehouse_inventorie_id' => $warehouseInventory->id,
                    ]);
                }

                // Cập nhật quantity trong bảng ColorSizes database
                $colorSize = ColorSize::where('sku', $inventory[1])->first();
                $colorSize->quantity = $inventory[4];
                $colorSize->save();
            }

            // Những inventory products trong database không nằm trong danh sách chỉnh sửa editInvProds thì sẽ xóa
            $delInvProds = $this->notInArray($inventoryProducts->toArray(), $editInvProds, 'sku');
            // dd($delInvProds);
            foreach ($delInvProds as $delInvProd) {
                InventoryProduct::where('sku', $delInvProd['sku'])->delete();
            }

            $data = [
                'status' => true,
                'messages' => 'Cập nhật thành công',
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

    public function notInArray($array1, $array2, $key)
    {
        $results = [];
        foreach ($array1 as $i) {
            $inArray = false;
            foreach ($array2 as $j) {
                if ($i[$key] === $j[$key]) {
                    $inArray = true;
                }
            }
            if (!$inArray) {
                $results[] = $i;
            }
        }
        return $results;
    }
}