<?php

namespace App\Exports;

use App\Model\Current;
use App\Model\Cat;
use App\Model\Modal;

use Maatwebsite\Excel\Concerns\FromCollection;

class UsersExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    protected $modal,$cat,$word;
    function __construct($modal,$cat,$wordtemp) {
        $this->modal = $modal;
        $this->cat = $cat;
        $this->wordtemp = $wordtemp;
    }

    public function collection()
    {
        $result = array();
        $modal = explode (",",$this->modal);
        $cat =  explode (",",$this->cat); 
        $wordtemp =  $this->wordtemp;      
        $word = explode (",", $wordtemp);
        
        for ($i=0; $i < count($modal); $i++) {  
            for ($j=0; $j < count($cat); $j++) { 
                if(!empty($wordtemp))
                {
                    for ($k=0; $k < count($word); $k++) {
                        $temprow = new Current();
                        $temprow = $temprow->where('m',$modal[$i])->where('j',$cat[$j])->where('k','like','%'.$word[$k].'%');
                        $temprow = $temprow->get();
                        
                        foreach($temprow as $item)
                        {                            
                            $searchcon1 = $item->m;    
                            $searchcon2 = $item->j;                 
                            $modaltemp = Modal::where('val',$searchcon1)->first();
                            $cattemp = Cat::where('val',$searchcon2)->first();                       
                            $temp_result = array(
                                'id' => $item->id,
                                'a' => $item->a,
                                'b' => $item->b,
                                'c' => $item->c,
                                'd' => $item->d,
                                'e' => $item->e,
                                'h' => $item->h,
                                'i' => $item->i,
                                'j' => $cattemp->name,
                                'k' => $item->k,
                                'm' => $modaltemp->name,
                            );
                            array_push($result,$temp_result);
                        }                    
                    }
                }    
                else
                {
                    $temprow = new Current();
                    $temprow = $temprow->where('m',$modal[$i])->where('j',$cat[$j]);
                    $temprow = $temprow->get(); 
                    foreach($temprow as $item)
                    {
                        $searchcon1 = $item->m;    
                        $searchcon2 = $item->j;                 
                        $modaltemp = Modal::where('val',$searchcon1)->first();
                        $cattemp = Cat::where('val',$searchcon2)->first();                       
                        $temp_result = array(
                            'id' => $item->id,
                            'a' => $item->a,
                            'b' => $item->b,
                            'c' => $item->c,
                            'd' => $item->d,
                            'e' => $item->e,
                            'h' => $item->h,
                            'i' => $item->i,
                            'j' => $cattemp->name,
                            'k' => $item->k,
                            'm' => $modaltemp->name,
                        );
                        array_push($result,$temp_result);
                    }                    
                }  
            }
        }
        
        return collect($result);
    }
}
