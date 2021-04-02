<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('user_id')->nullable();
            $table->text('modal')->nullable();   
            $table->text('cat')->nullable();                        
            $table->string('keyword')->nullable();   
            $table->text('adv_modal')->nullable();   
            $table->text('adv_cat')->nullable();                        
            $table->string('adv_keyword')->nullable();                        
            $table->string('adv_date')->nullable();                        
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
        Schema::dropIfExists('settings');
    }
}
