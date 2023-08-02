<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertProductsData extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            DB::table('products')->insert([
                [
                    'name' => 'Dép lông con sóc siêu cute xả khokho85k-85k sập giá',
                    'code' => 'EX1157330',
                    'total_quantity' => 3183,
                    'price' => 1700000,
                    'sale' => 50,
                    'description' => 'Hàng cực độc siêu sang chảnh, siêu chấtttt luôn nhá',
                    'short_description' => 'Siêu phẩm là đây chứ đâu',
                ]
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            //
        });
    }
}
