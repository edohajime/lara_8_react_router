<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class InsertWarehouseData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('warehouses', function (Blueprint $table) {
            DB::table('warehouses')->insert([
                [
                    'name' => 'Kho Hàng Shopee Express Tôn Thất Thuyết',
                    'location' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.107074036777!2d105.77787937393397!3d21.028401287793443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455bf874b17b1%3A0x6a38d7abcda9a06e!2zU2hvcGVlIEV4cHJlc3MgVMO0biBUaOG6pXQgVGh1eeG6v3Q!5e0!3m2!1svi!2s!4v1694573600565!5m2!1svi!2s',
                    'address' => ' 2 Tôn Thất Thuyết, Mỹ Đình, Cầu Giấy, Hà Nội, Việt Nam',
                ],
                [
                    'name' => 'Kho Hàng Shopee Xpress Tiên Dược, Sóc Sơn, Hà Nội',
                    'location' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d929.7399532677122!2d105.84147498700256!3d21.23344211845758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313503d67131e2cf%3A0x4c8252a26a871b13!2zS2hvIEjDoG5nIFNob3BlZSBYcHJlc3MgVGnDqm4gRMaw4bujYywgU8OzYyBTxqFuLCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1694573465555!5m2!1svi!2s',
                    'address' => ' Tiên Dược, Sóc Sơn, Hà Nội, Việt Nam',
                ],
                [
                    'name' => 'Kho Tổng Hợp 101 Cục Hậu Cần',
                    'location' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1861.8486550497996!2d105.75220864924144!3d21.0447940488627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454ebeedc3a19%3A0x64ab40180c2d7c4a!2zS2hvIFThu5VuZyBI4bujcCAxMDEgQ-G7pWMgSOG6rXUgQ-G6p24!5e0!3m2!1svi!2s!4v1694572883805!5m2!1svi!2s',
                    'address' => ' 101 Đ. Cầu Diễn, Phúc Diễn, Từ Liêm, Hà Nội',
                ],  
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
