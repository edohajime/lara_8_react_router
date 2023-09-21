<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertColorSizesData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('color_sizes', function (Blueprint $table) {
            DB::table('color_sizes')->insert([
                [
                    'sku' => 'SKVCNVIEIC',
                    'quantity' => 0,
                    'color_id' => 1,
                    'size_id' => 1
                ],
                [
                    'sku' => 'NSDIDSVIDI',
                    'quantity' => 0,
                    'color_id' => 1,
                    'size_id' => 2
                ],
                [
                    'sku' => 'DSJVEIDIVF',
                    'quantity' => 0,
                    'color_id' => 2,
                    'size_id' => 1
                ],
                [
                    'sku' => 'SDIDSVIVID',
                    'quantity' => 0,
                    'color_id' => 2,
                    'size_id' => 2
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