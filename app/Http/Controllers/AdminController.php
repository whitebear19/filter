<?php

namespace App\Http\Controllers;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Intervention\Image\ImageManagerStatic as Image;
use App\Model\Game;
use App\Model\MainCategory;
use App\Model\SubCategory;
use App\Model\Compatible;
use App\Model\Setting;
class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function dashboard()
    {
        $nav = "dashboard";
        $games = Game::all();
        return view('admin.dashboard',compact('nav','games'));
    }
    public function games(Request $request)
    {
        $nav = "games";    
        $id = $request->get('id');
        if(!empty($id))
        {
            if(Game::find($id))
            {
                $game = Game::find($id);
                $subcategory = SubCategory::where('main_id',$game->cat_main)->get();
            }
            else
            {
                $game = '';
                $subcategory = '';
            }
        }
        else
        {
            $game = '';
            $subcategory = '';
        }
        $category = MainCategory::all()->sortBy("name");
        $compatible = Compatible::all();        
        return view('admin.games',compact('nav','category','game','subcategory','compatible'));
    }

    public function category()
    {
        $nav = "category";
        $category = MainCategory::all()->sortBy("name");        
        return view('admin.category',compact('nav','category'));
    }
    public function compatible()
    {
        $nav = "compatible";
        $compatible = Compatible::all();
        return view('admin.compatible',compact('nav','compatible'));
    }
    public function oasis()
    {
        $nav = "oasis";
        $oasis = Setting::find('1')->oasis_enjoy_img;
        $headset = Setting::find('1')->oasis_headset_img;
        $video = Setting::find('1')->oasis_video;
        if(empty($oasis))
        {
            $oasis = '/public/assets/img/input_img.jpg';
        }
        if(empty($headset))
        {
            $headset = '/public/assets/img/input_img.jpg';
        }
        return view('admin.oasis',compact('nav','oasis','headset','video'));
    }
    // ajax_part

    public function postimgupload(Request $request)
    {
        $imageName = Str::random(5);
        $imageName = $imageName.time().'.'.$request->file('postimg')->getClientOriginalExtension();

        $request->file('postimg')->move(public_path('upload/game/'),$imageName);        
        $imgNameTemp = "upload/game/".$imageName;        
                
        return response()->json($imageName);
    }



    public function postimguploadsub(Request $request)
    {
        $imageName = Str::random(5);
        $imageName = $imageName.time().'.'.$request->file('postimg')->getClientOriginalExtension();

        $request->file('postimg')->move(public_path('upload/game/'),$imageName);        
        $imgNameTemp = "upload/game/".$imageName;        
                
        return response()->json($imageName);
    }

    public function upload_compatible_img(Request $request)
    {
        $imageName = Str::random(5);
        $imageName = $imageName.time().'.'.$request->file('postimg')->getClientOriginalExtension();

        $request->file('postimg')->move(public_path('upload/game/compatible/'),$imageName);        
        $imgNameTemp = "upload/game/compatible/".$imageName;        
                
        return response()->json($imageName);
    }

    public function upload_oasisenjoy_img(Request $request)
    {
        $imageName = Str::random(5);
        $imageName = $imageName.time().'.'.$request->file('postimg')->getClientOriginalExtension();

        $request->file('postimg')->move(public_path('upload/game/setting/'),$imageName);  
        $type = $request->get('type');      
        $imgNameTemp = "upload/game/setting/".$imageName;        
        $row = Setting::find('1');
        if($type == "1")
        {
            $row->oasis_enjoy_img = '/public/'.$imgNameTemp;
        }
        else if($type == "0")
        {
            $row->oasis_video = '/public/'.$imgNameTemp;
        }
        else
        {
            $row->oasis_headset_img = '/public/'.$imgNameTemp;
        }
        $row->save();    
        return response()->json(TRUE);
    }
    
    public function store_compatible(Request $request)
    {
        $name = $request->get('name');
        $img = $request->get('img');
        $row = Compatible::create([
            'name' => $name,
            'img'  => $img,
        ]);
        return response()->json($row->id);
    }
    public function delete_compatible(Request $request)
    {
        $id = $request->get('id');
        
        if(Compatible::find($id))
        {
            $row = Compatible::find($id);
            
            $row->delete();
        }
        return response()->json(TRUE);
    }
    

    public function store_game(Request $request)
    {
        $game_id = $request->get('game_id');
        $MainNames = '';
        $SubNames = '';
        if(!empty($request->get('image_name')))
        {            
            $MainNames = json_encode($request->get('image_name'));            
        } 

        if(!empty($request->get('image_name_sub')))
        {            
            $SubNames = json_encode($request->get('image_name_sub'));            
        } 

        if($game_id)
        {
            if(Game::find($game_id))
            {
                $thisGame = Game::find($game_id);
                $thisGame->title = $request->get('title');
                $thisGame->description = $request->get('description');
                $thisGame->price = $request->get('price');
                $thisGame->dev_name = $request->get('dev_name');
                $thisGame->dev_email = $request->get('dev_email');
                $thisGame->status = $request->get('status');
                $thisGame->main_imgs = $MainNames;
                $thisGame->sub_imgs = $SubNames;
                $thisGame->cat_main = $request->get('main_category');               
                $thisGame->available_os = $request->get('available_os');
                $thisGame->available_os_bit = $request->get('available_os_bit');
                $thisGame->processor = $request->get('processor');
                $thisGame->memory = $request->get('memory');
                $thisGame->direct = $request->get('direct');
                $thisGame->disk_space = $request->get('disk_space');
                $thisGame->graphics = $request->get('graphics');
                $thisGame->additional = $request->get('additional');
                $thisGame->language = json_encode($request->get('language'));
                $thisGame->playing_time = $request->get('playing_time');
                $thisGame->scoring = $request->get('scoring');
                $thisGame->num_players = $request->get('num_players');
                $thisGame->compatible_with = json_encode($request->get('compatible_with'));
                $thisGame->expected_date = $request->get('expected_date');
                $thisGame->save();
            }            
        }
        else
        {  
            Game::create([            
                'title'             => $request->get('title'),                          
                'description'       => $request->get('description'),
                'price'             => $request->get('price'),
                'dev_name'          => $request->get('dev_name'),
                'dev_email'         => $request->get('dev_email'),
                'status'            => $request->get('status'),
                'main_imgs'         => $MainNames,
                'sub_imgs'          => $SubNames,            
                'cat_main'          => $request->get('main_category'),  
                'available_os'      => $request->get('available_os'),            
                'available_os_bit'  => $request->get('available_os_bit'),            
                'processor'         => $request->get('processor'),            
                'memory'            => $request->get('memory'),            
                'direct'            => $request->get('direct'),            
                'disk_space'        => $request->get('disk_space'),            
                'graphics'          => $request->get('graphics'),            
                'additional'        => $request->get('additional'),            
                'language'          => json_encode($request->get('language')),            
                'playing_time'      => $request->get('playing_time'),            
                'scoring'           => $request->get('scoring'),           
                'num_players'       => $request->get('num_players'),          
                'compatible_with'    => json_encode($request->get('compatible_with')),
                'expected_date'     => $request->get('expected_date'),       
            ]);
        }        
        $result = TRUE;
        return response()->json($result);
    }
    
    public function change_game_status(Request $request)
    {
        $id = $request->get('id');
        $status = $request->get('status');
        $game = Game::find($id);
        $game->status = $status;
        $game->save();
        $result = TRUE;
        return response()->json($result);
    }

    public function store_main_category(Request $request)
    {
        $name = $request->get('name');
        MainCategory::create([
            'name' => $name,
        ]);
        $result = TRUE;
        return response()->json($result);
    }
    public function edit_main_category(Request $request)
    {        
        try {
            $name = $request->get('name');
            $id = $request->get('id');
            $thisCategory = MainCategory::find($id);
            $thisCategory->name = $name;
            $thisCategory->save();
            $result = TRUE;
            return response()->json($result);
        } catch (Throwable $e) {
            $result = FALSE;
            return response()->json($result);
        }
    }
    public function delete_main_category(Request $request)
    {        
        try {
            
            $id = $request->get('id');
            $thisCategory = MainCategory::find($id);
            $thisCategory->delete();
            $result = TRUE;
            return response()->json($result);
        } catch (Throwable $e) {
            $result = FALSE;
            return response()->json($result);
        }
    }
    
    public function store_sub_category(Request $request)
    {
        $name = $request->get('name');
        SubCategory::create([
            'name'         => $name,
            'main_id'      => $request->get('main_id'),
        ]);
        $result = TRUE;
        return response()->json($result);
    }
    public function edit_sub_category(Request $request)
    {        
        try {
            $name = $request->get('name');
            $id = $request->get('id');
            $thisCategory = SubCategory::find($id);
            $thisCategory->name = $name;
            $thisCategory->save();
            $result = TRUE;
            return response()->json($result);
        } catch (Throwable $e) {
            $result = FALSE;
            return response()->json($result);
        }
    }

    public function delete_sub_category(Request $request)
    {        
        try {
            
            $id = $request->get('id');
            $thisCategory = SubCategory::find($id);
            $thisCategory->delete();
            $result = TRUE;
            return response()->json($result);
        } catch (Throwable $e) {
            $result = FALSE;
            return response()->json($result);
        }
    }

    public function get_sub_category(Request $request)
    {      
        $sub = '';
        try {            
            $id = $request->get('id');
            $sub = SubCategory::where('main_id',$id)->get();            
            return response()->json($sub);
        } catch (Throwable $e) {
            
            return response()->json($sub);
        }
    }    

    public function delete_game(Request $request)
    {  
        try {            
            $id = $request->get('id');
            $sub = Game::find($id)->delete();            
            return response()->json(TRUE);
        } catch (Throwable $e) {
            
            return response()->json(FALSE);
        }
    } 
    
}
