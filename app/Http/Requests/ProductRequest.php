<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:' . Product::class,
            'total_quantity' => 'required|integer|min:0',
            'price' => 'required|integer|min:0',
            'sale' => 'nullable|integer|min:0',
            'description' => 'string|nullable',
            'short_description' => 'string|max:255|nullable',
        ];
    }

    public function messages() {
        return [
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
    }
}