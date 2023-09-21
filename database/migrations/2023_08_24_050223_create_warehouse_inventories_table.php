<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWarehouseInventoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouse_inventories', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('person_in_charge');
            $table->string('position');
            $table->tinyInteger('completed')->default(0);
            $table->tinyInteger('status')->default(0);
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
        Schema::dropIfExists('warehouse_inventories');
    }
}