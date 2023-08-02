<?php

use Illuminate\Database\Migrations\Migration;

class InsertSizesData extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('sizes')->insert([
            [
                'size' => 39,
                'size_code' => 'ndjrdndjrdndjrdndjrd',
                'quantity' => 5167,
                'color_id' => 1,
            ],
            [
                'size' => 40,
                'size_code' => 'akduvakduvakduvakduv',
                'quantity' => 5177,
                'color_id' => 1,
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
}
