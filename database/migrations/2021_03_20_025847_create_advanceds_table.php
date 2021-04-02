<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdvancedsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('advanceds', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nog');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();           
            $table->string('modality')->nullable();
            $table->string('category')->nullable();
            $table->string('event_description')->nullable();
            $table->string('buyer_entity')->nullable();
            $table->string('buyer_sub_entity')->nullable();
            $table->string('seller')->nullable();
            $table->string('qty_of_offers')->nullable();
            $table->string('amount')->nullable();
            $table->string('qty')->nullable();
            $table->string('unit_of_measurement')->nullable();
            $table->string('qty_sum')->nullable();
            $table->string('bigger_than')->nullable();
            $table->string('days')->nullable();
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
        Schema::dropIfExists('advanceds');
    }
}
