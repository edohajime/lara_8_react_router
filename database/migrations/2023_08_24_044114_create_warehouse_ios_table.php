<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWarehouseIosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouse_ios', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->tinyInteger('type');
            $table->string('requestor');
            $table->string('requestor_address')->nullable();
            $table->string('person_in_charge');
            $table->string('decision')->nullable();
            $table->string('cause')->nullable();
            $table->boolean('completed')->default(false);
            $table->foreignId('warehouse_id')->constrained();
            $table->unsignedBigInteger('staff_id');
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
        Schema::dropIfExists('warehouse_ios');
    }
}