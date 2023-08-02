<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->integer('total_quantity')->default(0);
            $table->integer('sold')->default(0);
            $table->integer('price')->default(0);
            $table->tinyInteger('sale')->default(0);
            $table->longText('description')->default('Nội dung mô tả sản phẩm');
            $table->string('short_description')->default('Mô tả ngắn sản phẩm');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
}
