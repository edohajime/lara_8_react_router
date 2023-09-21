<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnonymousOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('anonymous_orders', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->tinyInteger('status')->default(0);
            $table->string('guest_fullname')->nullable();
            $table->string('guest_province')->nullable();
            $table->string('guest_district')->nullable();
            $table->string('guest_ward')->nullable();
            $table->string('guest_address')->nullable();
            $table->string('guest_phone')->nullable();
            $table->unsignedBigInteger('staff_id');
            $table->unsignedBigInteger('address_id');
            $table->foreign('staff_id')->references('id')->on('staffs');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('anonymous_orders');
    }
}
