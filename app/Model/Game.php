<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $guarded = [];
    public function get_main()
    {        
        return $this->belongsTo('App\Model\MainCategory','cat_main');
    }
}
