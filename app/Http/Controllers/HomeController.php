<?php

namespace App\Http\Controllers;

use App\Model\Compatible;
use App\Model\Game;
use App\Model\GameCheck;
use App\Model\MainCategory;
use App\Model\Setting;
use App\Model\Current;
use App\Model\Modal;
use App\Model\Cat;
use App\Model\Todo;
use App\User;
use Auth;
use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use Mail;
use App\Mail\MyDemoMail;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UsersExport;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $mail = '';
        set_time_limit(8000000);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        if (empty(Auth::user()->email_verified_at)) {
            return redirect(url('/confirm'));
        } else {
            return redirect(url('/filter'));
        }
    }
    
    
   
    public function confirm(Request $request)
    {
        if (empty(Auth::user()->email_verified_at)) {
            $page = "";
            return view('confirm', compact('page'));
        } else {
            return redirect(url('/'));
        }
    }
    



    public function resend_link(Request $request)
    {
        if (Auth::user()) {
            $id = Auth::user()->id;
            $this->mail = Auth::user()->email;
            $enc_id = \Illuminate\Support\Facades\Crypt::encryptString($id);
            \Mail::to($this->mail)->send(new \App\Mail\VerifyMail($enc_id));
            return response()->json(true);
        } else {
            return response()->json(false);
        }
    }
    public function verify(Request $request, $id)
    {
        $id = \Illuminate\Support\Facades\Crypt::decryptString($id);
        $user = User::find($id);
        if (!empty($user)) {
            if (empty($user->email_verified_at)) {
                $user->email_verified_at = date('Y-m-d H:i:s');
                $user->save();
                return redirect(url('/filter'))->with("success", "Your account has been verified successfully!");
            }
        }
        return redirect(url('/'));
    }
    public function result(Request $request)
    {
        $filter1 = $request->post('id1');
        $filter2 = $request->post('id2');
        $filter3 = $request->post('id3');
        $key = array();
        array_push($key, $filter1, $filter2, $filter3);

        $csv = array();
        $file = 'upload/current.csv';
        $result = $this->csv_filter($file, $key);
        
        return view('filter', compact('result','key'));
    }
    public function get_filter(Request $request)
    {
        $modal = $request->get("modal");
        $cat = $request->get("cat");
        $wordtemp = $request->get("word");    
        
        $word = explode (",", $wordtemp);
        $result = array();
        $latest_updated = '';
        if(Auth::check())
        {
            $row = Setting::where('user_id',Auth::user()->id)->first();
            if($row)
            {
                $row->modal = json_encode($modal);
                $row->cat = json_encode($cat);
                $row->keyword = $wordtemp;
                $row->save();
            }
            else
            {
                Setting::create([
                    'user_id' => Auth::user()->id,
                    'modal' => json_encode($modal),
                    'cat' => json_encode($cat),
                    'keyword' => $wordtemp,
                ]);
            }
            
            for ($i=0; $i < count($modal); $i++) {  
                for ($j=0; $j < count($cat); $j++) { 
                    if(!empty($wordtemp))
                    {
                        for ($k=0; $k < count($word); $k++) {
                            $temprow = new Current();
                            
                            $temprow = $temprow->where('m','like','%'.$modal[$i].'%')->where('j','like','%'.$cat[$j].'%');
                            $temprow = $temprow->get();
                           
                            foreach($temprow as $item)
                            {
                               
                                $str = $item->k;
                                $str = explode("||",$str);
                                $show = "";
                                if (str_contains(strtolower($str[0]), strtolower($word[$k]))) { 
                                    $show = 'ok';
                                }
                                
                                $searchcon1 = $item->m;    
                                $searchcon2 = $item->j;                 
                                
                                $modal_search = explode (" ", $searchcon1);  
                                $modaltemp = "";  
                                for ($kk=0; $kk < count($modal_search); $kk++) {
                                    $modaltemp = $modaltemp." ".Modal::where('val',$modal_search[$kk])->first()->name;
                                }       
                                
                                $cat_search = explode (" ", $searchcon2);  
                                $cattemp = "";  
                                for ($l=0; $l < count($cat_search); $l++) {
                                    if(!empty($cat_search[$l]))
                                    {
                                        $cattemp = $cattemp.Cat::where('val',$cat_search[$l])->first()->name;
                                    }
                                    
                                }   

                                $temp_result = array(
                                    'id' => $item->id,
                                    'a' => $item->a,
                                    'b' => $item->b,
                                    'c' => $item->c,
                                    'd' => $item->d,
                                    'e' => $item->e,
                                    'h' => $item->h,
                                    'i' => $item->i,
                                    'j' => $cattemp,
                                    'k' => $item->k,
                                    'm' => $modaltemp,
                                    'word' => $show,
                                );
                                $check_valid = TRUE;
                                foreach($result as $point)
                                {
                                    if($point['a'] == $item->a)
                                    {
                                        $check_valid = FALSE;
                                        break;
                                    }
    
                                }
                                if($check_valid)
                                {
                                    array_push($result,$temp_result);
                                }
                                
                            }                    
                        }
                    }    
                    else
                    {
                        $temprow = new Current();
                        $temprow = $temprow->where('m','like','%'.$modal[$i].'%')->where('j','like','%'.$cat[$j].'%');
                        $temprow = $temprow->get(); 
                        
                        foreach($temprow as $item)
                        {                               

                            $searchcon1 = $item->m;    
                            $searchcon2 = $item->j;                 
                           
                            $modal_search = explode (" ", $searchcon1);  
                            $modaltemp = "";  
                            for ($k=0; $k < count($modal_search); $k++) {
                                $modaltemp = $modaltemp." ".Modal::where('val',$modal_search[$k])->first()->name;
                            }       
                            
                            $cat_search = explode (" ", $searchcon2);  
                            $cattemp = "";  
                            for ($l=0; $l < count($cat_search); $l++) {
                                if(!empty($cat_search[$l]))
                                {
                                    $cattemp = $cattemp.Cat::where('val',$cat_search[$l])->first()->name;
                                }
                                
                            }       
                            $temp_result = array(
                                'id' => $item->id,
                                'a' => $item->a,
                                'b' => $item->b,
                                'c' => $item->c,
                                'd' => $item->d,
                                'e' => $item->e,
                                'h' => $item->h,
                                'i' => $item->i,
                                'j' => $cattemp,
                                'k' => $item->k,
                                'm' => $modaltemp,
                                'word' => '',
                            );
                            $check_valid = TRUE;
                            foreach($result as $point)
                            {
                                if($point['a'] == $item->a)
                                {
                                    $check_valid = FALSE;
                                    break;
                                }

                            }
                            if($check_valid)
                            {
                                array_push($result,$temp_result);
                            }
                            
                        }                    
                    }  
                }
            }
            
            $temp = new Current();
            $temp = $temp->get();
            $temp = $temp->first();
            $latest_updated = (string)$temp->created_at;
            return response()->json([
                'result' => $result,'auth' => true,'latest_updated' => $latest_updated
            ]);
        }
        else
        {
            return response()->json([
                'result' => $result,'auth' => false ,'latest_updated' => ''
            ]);
        }
               
        
        

    }

    public function set_todo(Request $request)
    {
        $user = Auth::user();
        $word = $request->get('word');
        $project_id = $request->get('pid');
        
        $row = Todo::create([
            'project_id' => $project_id,
            'user_id' => Auth::user()->id,
            'word' => $word,
        ]);
        return response()->json([
            'result' => 'true',            
        ]);
    }
   
    public function fileExport(Request $request) 
    {           
        $modal = $request->get("modal");
        $cat = $request->get("cat");
        $wordtemp = $request->get("word");       
       
        return Excel::download(new UsersExport($modal,$cat,$wordtemp), 'filters.xlsx');
    }  
    public function filter()
    {
        if(Auth::check())
        {
            $result = [];
            $key = array();
            $cat = Cat::all();
            $modal = Modal::all();
            $row = Setting::where('user_id',Auth::user()->id)->first();
            if(!empty($row))
            {
                $set_modal = json_decode($row->modal);
                $set_cat = json_decode($row->cat);
                $set_keyword = $row->keyword;
            }
            else
            {
                $set_modal = "";
                $set_cat = "";
                $set_keyword = "";
            }
            
            
            return view('filter', compact('result', 'key','cat','modal','set_modal','set_cat','set_keyword'));
        }
        else
        {
            return redirect('/login');
        }
        
    }
    public function csv_filter($file, $key)
    {
        $file = fopen(public_path($file), 'r');
        while (($result = fgetcsv($file)) !== false) {
            $csv[] = $result;
        }
        fclose($file);
        $data = array();
        foreach ($csv as $val1) {
            if (is_array($val1) and count($val1)) {
                if(!empty($key[2])){
                    if (in_array($key[0], $val1) && in_array($key[1], $val1) && strpos($val1[8],$key[2])!== false) {
                        array_push($data, $val1);
                    }
                }elseif(empty($key[2])){
                    if (in_array($key[0], $val1) && in_array($key[1], $val1)) {
                        array_push($data, $val1);
                    }
                }
            }
        }
        return $data;
    }
    public function scraping(Request $request)
    {
        $id = $request->post('id');
        $keyword = $request->post('keyword');
        $process = new Process('python public/python/test.py '.$id);
        $process->run();
        if (!$process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }
       $enc_id = \Illuminate\Support\Facades\Crypt::encryptString($id);
       
        $this->mail=Auth::user()->email;
    	Mail::to($this->mail)->send(new \App\Mail\Sendfile($enc_id));
    
    }
    public function download(Request $request, $id){
        
        $id = \Illuminate\Support\Facades\Crypt::decryptString($id);
        $file= public_path('scraping_result'). "/".$id.".zip";
        $headers = array(
                  'Content-Type: application/zip',
                );
                return response()->download($file, $id.'.zip', $headers);
    }
    public function consultakey(Request $request)
    {
        $url = $request->get("url");
        $word = $request->get("word");    
        $err = '';    
        try {            
            $response = json_decode(file_get_contents("http://45.32.164.30/consultakey?word=".$word."&url=".$url));
            $result = $response->result;
            $filename = $response->filename.".zip";
          
        } catch (\Exception $e) {
        
            $err =  $e;              
            $result = 'false';
            $filename = "";
        }
        
        
        
        $this->mail=Auth::user()->email;
            
        Mail::to($this->mail)->send(new \App\Mail\Sendfile($filename));
        return response()->json([
            'result' => $result,'filename' =>  $filename ,'auth' => TRUE,'err' => $err   
        ]);
            
       
        
    }
    

}
