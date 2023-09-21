<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeyToAnonymousOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('anonymous_orders', function (Blueprint $table) {
            $table->unsignedBigInteger('color_size_id');
            $table->foreign('color_size_id')->references('id')->on('color_sizes');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('anonymous_orders', function (Blueprint $table) {
            $table->dropForeign(['color_size_id']);
        });
    }
}
