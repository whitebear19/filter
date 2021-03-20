<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class MainCategory extends Model
{
    protected $guarded = [];
    public function sub()
    {
        return $this->hasMany('App\Model\SubCategory','main_id');
    }
}
