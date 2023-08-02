<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertProductImagesData extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            DB::table('product_images')->insert([
                [
                    'url' => '/storages/images/giay-dep-thumb4281.jpg',
                    'product_id' => 1
                ]
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_images', function (Blueprint $table) {
            DB::table('product_images')->where('id', 1)->delete();
        });
    }
}
