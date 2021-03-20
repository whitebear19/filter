<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class GameCheck extends Model
{
    protected $guarded = [];
    public function get_game()
    {        
        return $this->belongsTo('App\Model\Game','game_id');
    }
}
