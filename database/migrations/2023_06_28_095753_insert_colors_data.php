<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertColorsData extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('colors', function (Blueprint $table) {
            DB::table('colors')->insert([
                [
                    'color' => 'Sóc ghi',
                    'color_code' => 'abdrdabdrdabdrdabdrd',
                    'product_id' => 1
                ],
                [
                    'color' => 'Sóc nâu',
                    'color_code' => 'ubdsfubdsfubdsfubdsf',
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
        //
    }
}
