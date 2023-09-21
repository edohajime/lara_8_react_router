<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('title');
            $table->string('tags');
            $table->string('thumbnail');
            $table->string('summary');
            $table->longText('content');
            $table->integer('views');
            $table->boolean('status')->default(true);
            $table->unsignedBigInteger('staff_id');
            $table->foreignId('categorie_id')->constrained();
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
        Schema::dropIfExists('blogs');
    }
}
