<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    protected $guarded = [];
    public function main()
    {
        return $this->belongsTo('App\Model\MainCategory','main_id');
    }
}
