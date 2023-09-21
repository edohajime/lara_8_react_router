<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    public function list(Request $request)
    {
        $warehouses = Warehouse::all();
        // dd(count($warehouses));
        $data = [
            'status' => count($warehouses) === 0 ? false : true,
            'warehouses' => $warehouses,
        ];

        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        $data = [];

        $pattern = '/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[[:ascii:]]*?\.[[:ascii:]]*?\.[[:ascii:]]*?\.[[:ascii:]]*?\.[[:ascii:]]*?" width="[0-9]*?" height="[0-9]*?" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"><\/iframe>/';
        if (preg_match($pattern, $request->location) === 0) {
            $data = [
                'status' => false,
                'messages' => 'Trường định vị trên bản đồ không đúng định dạng!',
            ];

            return response()->json($data, 200);
        }

        $location = explode('"', $request->location)[1];

        $rules = [
            'name' => 'required|string|max:255|unique:' . Warehouse::class,
            'location' => 'required|string',
            'address' => 'required|string',
        ];

        $messages = [
            'name.required' => 'Thiếu tên kho!',
            'name.max' => 'Tên kho quá dài (< 255 kí tự)!',
            'name.unique' => 'Tên kho đã tồn tại!',
            'location.required' => 'Thiếu định vị kho!',
            'address.required' => 'Thiếu địa chỉ kho!',
        ];

        $validate = validator($request->all(), $rules, $messages);

        if ($validate->fails()) {
            $data = [
                'status' => false,
                'messages' => $validate->errors()->first(),
            ];
            return response()->json($data, 200);
        }

        try {
            Warehouse::create([
                'name' => $request->name,
                'location' => $location,
                'address' => $request->address,
            ]);
            $data = [
                'status' => true,
                'messages' => 'Thêm mới thành công!',
            ];
        } catch (\Throwable $th) {
            dd($th);
            $data = [
                'status' => false,
                'messages' => $th->getMessage(),
            ];
        }

        return response()->json($data, 200);
    }

    public function show(Warehouse $warehouse)
    {
        $result = [
            'name' => $warehouse->name,
            'location' => $warehouse->location,
            'address' => $warehouse->address,
        ];

        return response()->json($result, 200);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        // dd($request->all);
        $data = [];
        $location = "";

        if ($request->location) {
            $pattern = '/<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=[[:ascii:]]*?\.[[:ascii:]]*?\.[[:ascii:]]*?\.[[:ascii:]]*?\.[[:ascii:]]*?" width="[0-9]*?" height="[0-9]*?" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"><\/iframe>/';
            if (preg_match($pattern, $request->location) === 0) {
                $data = [
                    'status' => false,
                    'messages' => 'Trường định vị trên bản đồ không đúng định dạng!',
                ];

                return response()->json($data, 200);
            }

            $location = explode('"', $request->location)[1];
        } else {
            $location = $warehouse->location;
        }

        $rules = [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
        ];

        $messages = [
            'name.required' => 'Thiếu tên kho!',
            'name.max' => 'Tên kho quá dài (< 255 kí tự)!',
            'address.required' => 'Thiếu địa chỉ kho!',
        ];

        $validate = validator($request->all(), $rules, $messages);

        if ($validate->fails()) {
            $data = [
                'status' => false,
                'messages' => $validate->errors()->first(),
            ];
            return response()->json($data, 200);
        }

        try {
            $warehouse->name = $request->name;
            $warehouse->location = $location;
            $warehouse->address = $request->address;
            $warehouse->save();

            $data = [
                'status' => true,
                'messages' => 'Cập nhật thành công!',
            ];
        } catch (\Throwable $th) {
            // dd($th);
            $data = [
                'status' => false,
                'messages' => $th->getMessage(),
            ];
        }

        return response()->json($data, 200);
    }
}