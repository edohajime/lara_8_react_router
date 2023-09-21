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
                'product_id' => 1
            ],
            [
                'size' => 40,
                'size_code' => 'akduvakduvakduvakduv',
                'product_id' => 1
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
