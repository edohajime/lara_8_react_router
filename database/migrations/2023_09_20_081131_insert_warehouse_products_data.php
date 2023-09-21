<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertWarehouseProductsData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('warehouse_products', function (Blueprint $table) {
            DB::table('warehouse_products')->insert([
                [
                    'sku' => 'SKVCNVIEIC',
                    'quantity' => 0,
                    'warehouse_id' => 3,
                ],
                [
                    'sku' => 'NSDIDSVIDI',
                    'quantity' => 0,
                    'warehouse_id' => 3,
                ],
                [
                    'sku' => 'DSJVEIDIVF',
                    'quantity' => 0,
                    'warehouse_id' => 3,
                ],
                [
                    'sku' => 'SDIDSVIVID',
                    'quantity' => 0,
                    'warehouse_id' => 3,
                ]
            ]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}