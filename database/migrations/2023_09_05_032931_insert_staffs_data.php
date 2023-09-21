<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertStaffsData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('staffs', function (Blueprint $table) {
            DB::table('admins')->insert([
                [
                    'fullname' => 'Hà Tuấn Anh',
                    'phone' => '0983716625',
                    'email' => 'tuananh16122000@gmail.com',
                ]
            ]);
            DB::table('staffs')->insert([
                [
                    'code' => 'SDHCFNEFIJEWSKVFDPGR',
                    'fullname' => 'Hà Tuấn Anh',
                    'gender' => 'Nam',
                    'nationality' => 'Việt Nam',
                    'residence' => 'thôn Đồng Đoài, xã Đại Đồng Thành, huyện Thuận Thành, tỉnh Bắc Ninh',
                    'citizen_identification' => '124843874732',
                    'phone' => '0983716625',
                    'email' => 'tuananh16122000@gmail.com',
                    'admin_id' => 1
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