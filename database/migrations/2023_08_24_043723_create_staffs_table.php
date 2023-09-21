<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

class CreateStaffsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('staffs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('fullname');
            $table->string('gender');
            $table->string('birthday')->default(Carbon::now()->format('d-m-Y'));
            $table->string('nationality');
            $table->string('residence');
            $table->string('citizen_identification');
            $table->string('technical_qualification')->nullable();
            $table->string('vocation_skill_lv')->nullable();
            $table->string('position')->nullable();
            $table->string('labor_contract_type')->nullable();
            $table->date('start_date')->nullable();
            $table->integer('social_insurance_number')->nullable();
            $table->integer('salary')->nullable();
            $table->integer('increase_salary')->nullable();
            $table->integer('bonus_salary')->nullable();
            $table->tinyInteger('days_off_year')->nullable();
            $table->integer('overtime_hours')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->tinyInteger('status')->default(true);
            $table->foreignId('admin_id')->constrained();
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
        Schema::dropIfExists('staffs');
    }
}
