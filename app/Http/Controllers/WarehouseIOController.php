<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ColorSize;
use App\Models\Package;
use App\Models\Warehouse;
use App\Models\WarehouseIO;
use App\Models\WarehouseProduct;
use DateTime;
use Illuminate\Http\Request;
// use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class WarehouseIOController extends Controller
{
    public function list()
    {
        $warehouseIOs = WarehouseIO::all();
        $results = [];

        foreach ($warehouseIOs as $warehouseIO) {
            $createdAt = new DateTime($warehouseIO->created_at);
            $updatedAt = new DateTime($warehouseIO->updated_at);
            $warehouse = Warehouse::where('id', $warehouseIO->warehouse_id)->first();
            $result = [
                'id' => $warehouseIO->id,
                'code' => $warehouseIO->code,
                'type' => $warehouseIO->type,
                'requestor' => $warehouseIO->requestor,
                'requestor_address' => $warehouseIO->requestor_address ? $warehouseIO->requestor_address : null,
                'person_in_charge' => $warehouseIO->person_in_charge,
                'decision' => $warehouseIO->decision ? $warehouseIO->decision : null,
                'cause' => $warehouseIO->cause ? $warehouseIO->cause : null,
                'completed' => $warehouseIO->completed,
                'status' => $warehouseIO->status,
                'warehouse' => $warehouse->name,
                'staff_id' => $warehouseIO->staff_id,
                'created_at' => $createdAt->format('d-m-Y'),
                'updated_at' => $updatedAt->format('d-m-Y'),
            ];

            // dd($result);
            // dd($warehouseIO);
            $results[] = $result;
        }

        $data = [
            'status' => count($warehouseIOs) === 0 ? false : true,
            'warehouseIOs' => $results,
        ];

        return response()->json($data, 200);
    }

    public function show(WarehouseIO $warehouseIO)
    {
        $warehouse = Warehouse::where('id', $warehouseIO->warehouse_id)->first();
        // dd($warehouse);
        // dd($warehouseIO->decision);
        $warehouseIO->warehouse = $warehouse->name;
        if ($warehouseIO->type === 0) {
            $decisions = explode(',', $warehouseIO->decision);
            // dd($decisions);
            $warehouseIO->according = $decisions[0];
            $warehouseIO->number = $decisions[1];
            $warehouseIO->day = $decisions[2];
            $warehouseIO->month = $decisions[3];
            $warehouseIO->year = $decisions[4];
            $warehouseIO->decider = $decisions[5];
        }

        $results = [];
        $packages = Package::where('warehouse_io_id', $warehouseIO->id)->get();
        foreach ($packages as $package) {
            $result = [
                'name' => $package->name,
                'sku' => $package->sku,
                'unit' => $package->unit,
                'quantity' => $package->quantity,
                'realQuantity' => $package->real_quantity,
                'price' => $package->price
            ];
            $results[] = $result;
        }
        $warehouseIO->packages = $results;
        // dd($warehouseIO);

        $data = [
            'status' => true,
            'warehouseIO' => $warehouseIO,
        ];

        return response()->json($data, 200);
    }

    public function update(Request $request, WarehouseIO $warehouseIO)
    {
        // dd($request->type === 0);
        $names = $request->name;
        $skus = $request->sku;
        $units = $request->unit;
        $quantities = $request->quantity;
        $realQuantities = $request->real_quantity;
        $prices = $request->price;

        $data = [$names, $skus, $units, $quantities, $realQuantities, $prices];
        $dataLabel = [
            "Tên nhãn hàng sản phẩm" => $names,
            "Mã sản phẩm" => $skus,
            "Đơn vị tính" => $units,
            "Số lượng theo chứng từ" => $quantities,
            "Số lượng thực nhập" => $realQuantities,
            "Đơn giá" => $prices,
        ];

        $rules = [
            'requestor' => 'required|string|max:255',
            'person_in_charge' => 'required|string|max:255',
        ];

        $message = [
            'requestor.required' => 'Phải có người yêu cầu',
            'requestor.max' => 'Tên người yêu cầu quá dài (< 255 kí tự)',
            'person_in_charge.required' => 'Phải có người phụ trách',
            'person_in_charge.max' => 'Tên người phụ trách quá dài (< 255 kí tự)',
        ];


        if (intval($request->type) === 0) {
            $rules += [
                'according' => 'required|string|max:255',
                'number' => 'required|string|max:255',
                'day' => 'required|string|max:255',
                'month' => 'required|string|max:255',
                'year' => 'required|string|max:255',
                'decider' => 'required|string|max:255',
            ];

            $message += [
                'according.required' => 'Phải ghi rõ theo quyết định gì',
                'according.max' => 'Trường nhập quá dài (< 255 kí tự)',
                'number.required' => 'Phải có số quyết định',
                'number.max' => 'Số quyết định quá dài (< 255 kí tự)',
                'day.required' => 'Phải có ngày',
                'day.max' => 'Ngày quá dài (< 255 kí tự)',
                'month.required' => 'Phải có tháng',
                'month.max' => 'Tháng quá dài (< 255 kí tự)',
                'year.required' => 'Phải có năm',
                'year.max' => 'Năm quá dài (< 255 kí tự)',
                'decider.required' => 'Phải có tên người quyết định',
                'decider.max' => 'Tên người quyết định quá dài (< 255 kí tự)',
            ];

        } else {
            $rules += [
                'cause' => 'required|string|max:255',
                'address' => 'required|string|max:255',
            ];
            $message += [
                'cause.required' => 'Phải có lý do',
                'cause.max' => 'Lý do quá dài (< 255 kí tự)',
                'address.required' => 'Phải có địa chỉ đơn vị yêu cầu',
                'address.max' => 'Địa chỉ quá dài (< 255 kí tự)',
            ];
        }

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
                // dd($key);
                $data = [
                    'status' => false,
                    'messages' => 'Không được để trống ' . $key,
                ];

                // dd($data['messages']);
                return response()->json($data, 200);
            }
        }
        $packages = [];
        for ($i = 0; $i < count($data[0]); $i++) {
            // Gán dữ liệu của cột thứ $i trong mảng 2 chiều $data cho $packages[$i]
            $packages[] = array_column($data, $i);
        }

        // dd($packages);
        $warehouse = Warehouse::where('name', $request->warehouse)->first();
        if (intval($request->type) === 0) {
            $decision = implode(
                ',',
                array(
                    $request->according,
                    $request->number,
                    $request->day,
                    $request->month,
                    $request->year,
                    $request->decider
                )
            );
            $warehouseIO->requestor = $request->requestor;
            $warehouseIO->person_in_charge = $request->person_in_charge;
            $warehouseIO->decision = $decision;
            $warehouseIO->warehouse_id = $warehouse->id;
            $warehouseIO->staff_id = $request->staff_id;
        } else {
            $warehouseIO->requestor = $request->requestor;
            $warehouseIO->requestor_address = $request->address;
            $warehouseIO->person_in_charge = $request->person_in_charge;
            $warehouseIO->cause = $request->cause;
            $warehouseIO->warehouse_id = $warehouse->id;
            $warehouseIO->staff_id = $request->staff_id;
        }

        $warehouseIO->completed = intval($request->completed);
        $warehouseIO->save();

        // Lấy packages trong database
        $resultPkgs = Package::where('warehouse_io_id', $warehouseIO->id)->get();

        $editPkgs = [];
        foreach ($packages as $package) {
            $existed = false;
            // Cập nhật quantity trong bảng ColorSizes database
            // Nếu là phiếu xuất thì trừ quantity, ngược lại thì cộng
            $colorSize = ColorSize::where('sku', $package[1])->first();

            // Cập nhật lại quantity của loại hàng tương ứng thuộc kho hiện tại trong 
            // bảng warehouse products
            $warehousePd = $warehouse->warehouseproducts()->where('sku', $package[1])->first();

            foreach ($resultPkgs as $resultPkg) {
                if ($package[1] === $resultPkg->sku) {
                    $existed = true;

                    // Biến trạng thái cho biết có cần thiết phải giữ nguyên không cập nhật $warehousePd 
                    // hay không?
                    // Mặc định là cập nhật $warehousePd
                    $hold = false;

                    // Nếu không có trong warehouse products thì lưu lại
                    if (!$warehousePd) {
                        // Nếu là phiếu xuất thì ném thông báo không có hàng để xuất
                        if (intval($request->type) === 1) {
                            $data = [
                                'status' => false,
                                'messages' => 'Không có hàng để xuất!'
                            ];
                            return response()->json($data, 200);
                        }

                        // Đánh dấu trạng thái giữ nguyên không sửa $warehousePd
                        $hold = true;
                        WarehouseProduct::create([
                            'sku' => $package[1],
                            'quantity' => $package[4],
                            'warehouse_id' => $warehouse->id,
                        ]);
                    }

                    // Nếu đã lưu thì cập nhật lại quantity (nhập - trừ, xuất - cộng)
                    if ($resultPkg->real_quantity !== null || $resultPkg->real_quantity >= 0) {
                        if (intval($request->type) === 0) {
                            $colorSize->quantity -= $resultPkg->real_quantity;

                            // Nếu trạng thái là không giữ nguyên thì cập nhật $warehousePd
                            if (!$hold) {
                                $warehousePd->quantity -= $resultPkg->real_quantity;
                            }
                        } else {
                            $colorSize->quantity += $resultPkg->real_quantity;

                            // Nếu trạng thái là không giữ nguyên thì cập nhật $warehousePd
                            if (!$hold) {
                                $warehousePd->quantity += $resultPkg->real_quantity;
                            }
                        }
                    }

                    if (!$hold) {
                        // Nếu có trong bảng warehouse products thì cập nhật quantity
                        if (intval($request->type) === 0) {
                            $warehousePd->quantity += $package[4];
                        } else {
                            $warehousePd->quantity -= $package[4];
                        }

                        // Lưu lại cập nhật
                        $warehousePd->save();

                        // dd($warehousePd->quantity);
                    }

                    // dd($resultPkg->real_quantity);

                    $editPkgs[] = $resultPkg->toArray();
                    // Không cần sửa sku, warehouse_id
                    $resultPkg->name = $package[0];
                    $resultPkg->unit = $package[2];
                    $resultPkg->quantity = intval($package[3]);
                    $resultPkg->real_quantity = intval($package[4]);
                    $resultPkg->price = intval($package[5]);
                    $resultPkg->save();
                }
            }

            // Nếu request package không nằm trong truy vấn thì thêm
            if (!$existed) {
                Package::create([
                    'name' => $package[0],
                    'sku' => $package[1],
                    'unit' => $package[2],
                    'quantity' => $package[3],
                    'real_quantity' => $package[4],
                    'price' => $package[5],
                    'warehouse_io_id' => $warehouseIO->id,
                ]);
            }

            // Cập nhật quantity của bảng colorsize
            if (intval($request->type) === 0) {
                $colorSize->quantity += $package[4];
            } else {
                $colorSize->quantity -= $package[4];
            }
            $colorSize->save();
        }

        // Những packages trong database không nằm trong danh sách chỉnh sửa editPkgs thì sẽ bị xóa
        $delPkgs = $this->notInArray($resultPkgs->toArray(), $editPkgs, 'sku');
        foreach ($delPkgs as $delPkg) {
            Package::where('sku', $delPkg['sku'])->delete();
        }

        $data = [
            'status' => true,
            'messages' => 'Cập nhật thành công',
        ];
        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        // dd(Carbon::now()->format('d-m-Y'));
        // $a = gettype($request->type);
        // $data = [
        //     'status' => false,
        //     'messages' => $a,
        // ];
        // return response()->json($data, 200);
        $names = $request->name;
        $skus = $request->sku;
        $units = $request->unit;
        $quantities = $request->quantity;
        $prices = $request->price;

        $data = [$names, $skus, $units, $quantities, $prices];
        $dataLabel = [
            "Tên nhãn hàng sản phẩm" => $names,
            "Mã sản phẩm" => $skus,
            "Đơn vị tính" => $units,
            "Số lượng theo chứng từ" => $quantities,
            "Đơn giá" => $prices,
        ];

        $rules = [
            'requestor' => 'required|string|max:255',
            'person_in_charge' => 'required|string|max:255',
        ];

        $message = [
            'requestor.required' => 'Phải có người yêu cầu',
            'requestor.max' => 'Tên người yêu cầu quá dài (< 255 kí tự)',
            'person_in_charge.required' => 'Phải có người phụ trách',
            'person_in_charge.max' => 'Tên người phụ trách quá dài (< 255 kí tự)',
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

        $packages = [];
        for ($i = 0; $i < count($data[0]); $i++) {
            // Gán dữ liệu của cột thứ $i trong mảng 2 chiều $data cho $packages[$i]
            $packages[] = array_column($data, $i);
        }
        // dd($packages);

        // Lưu WarehouseIO
        $warehouseIOCode = Str::random(20);
        $warehouse = Warehouse::where('name', $request->warehouse)->first();
        if (intval($request->type) === 0) {
            $decision = implode(
                ',',
                array(
                    $request->according,
                    $request->number,
                    $request->day,
                    $request->month,
                    $request->year,
                    $request->decider
                )
            );
            // dd($decision);
            WarehouseIO::create([
                'type' => $request->type,
                'code' => $warehouseIOCode,
                'requestor' => $request->requestor,
                'person_in_charge' => $request->person_in_charge,
                'decision' => $decision,
                'warehouse_id' => $warehouse->id,
                'staff_id' => $request->staff_id,
            ]);
        } else {
            WarehouseIO::create([
                'type' => $request->type,
                'code' => $warehouseIOCode,
                'requestor' => $request->requestor,
                'requestor_address' => $request->address,
                'person_in_charge' => $request->person_in_charge,
                'cause' => $request->cause,
                'warehouse_id' => $warehouse->id,
                'staff_id' => $request->staff_id,
            ]);
        }

        // Lưu packages vào database
        $warehouseIO = WarehouseIO::where('code', $warehouseIOCode)->first();
        foreach ($packages as $package) {
            Package::create([
                'name' => $package[0],
                'sku' => $package[1],
                'unit' => $package[2],
                'quantity' => $package[3],
                'price' => $package[4],
                'warehouse_io_id' => $warehouseIO->id,
            ]);
        }

        $data = [
            'status' => true,
            'messages' => 'Thêm mới thành công',
        ];

        return response()->json($data, 200);
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