<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('review_code');
            $table->tinyInteger("stars");
            $table->string("correct_description")->nullable();
            $table->string("review_color")->nullable();
            $table->string("review_material")->nullable();
            $table->string("content")->nullable();
            $table->boolean("has_review")->default(false);
            $table->boolean("has_media")->default(false);
            $table->smallInteger("like")->default(0);
            $table->boolean("has_like")->default(false);
            $table->boolean("status")->default(true);
            $table->boolean("show_name")->default(true);
            $table->foreignId('size_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('product_id')->constrained();
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
        Schema::dropIfExists('reviews');
    }
}
