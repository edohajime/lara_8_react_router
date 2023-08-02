<?php

use Illuminate\Database\Migrations\Migration;

class InsertRolesData extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('roles')->insert([
            ['role' => 'Administrator'],
            ['role' => 'Manager'],
            ['role' => 'User']
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('roles')->whereIn('role', ['Admin', 'Manager', 'User'])->delete();
    }
}
