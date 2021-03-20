<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGamesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('games', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            $table->text('description');
            $table->string('price');
            $table->string('dev_name')->nullable();
            $table->string('dev_email')->nullable();
            $table->string('status')->nullable();
            $table->text('main_imgs')->nullable();
            $table->text('sub_imgs')->nullable();
            $table->string('cat_main')->nullable();
            $table->string('cat_sub')->nullable();
            $table->string('available_os')->nullable();
            $table->string('available_os_bit')->nullable();
            $table->string('processor')->nullable();
            $table->string('memory')->nullable();
            $table->string('direct')->nullable();
            $table->string('disk_space')->nullable();
            $table->string('graphics')->nullable();
            $table->string('additional')->nullable();
            $table->text('language')->nullable();
            $table->string('playing_time')->nullable();
            $table->string('scoring')->nullable();
            $table->string('num_players')->nullable();            
            $table->text('compatible_with')->nullable();
            $table->date('expected_date')->nullable();
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
        Schema::dropIfExists('games');
    }
}
