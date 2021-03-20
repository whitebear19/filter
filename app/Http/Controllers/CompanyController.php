<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Model\Game;
use App\Model\MainCategory;
use App\Model\SubCategory;
use App\Model\Compatible;
use App\Model\Setting;
use App\Model\GameCheck;
use App\User;
use Hash;
class CompanyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function dashboard(Request $request)
    {
        $users = User::where('company',Auth::user()->id)->get();
        $nav = "dashboard";  
        return view('company.dashboard',compact('nav','users'));
    }

    public function user(Request $request)
    {
        $nav = "user";  
        return view('company.user',compact('nav'));
    }

    // ajax part

    public function create_user(Request $request)
    {
        if(Auth::check())
        {
            $email = $request->get('email');
            $check_email = User::where('email',$email)->count();
            if($check_email>0)
            {
                return response()->json([
                    'result'   => 'email_err'
                ]);
            }
            else
            {
                $cnt_member = User::where('company',Auth::user()->id)->count();
                if($cnt_member<Auth::user()->company_plan)
                {
                    User::create([
                        'name'  => $request->get('name'),
                        'email'  => $email,
                        'password'  => Hash::make($request->get('password')),
                        'company'  => Auth::user()->id,
                        'role'  => '0',
                        'type'  => '0',
                        'paid'  => '1',
                    ]);
                    return response()->json([
                        'result' => 'ok'
                    ]);
                }
                else
                {
                    return response()->json([
                        'result' => 'over_err'
                    ]);
                }
            }
        }
        else
        {
            return response()->json([
                'result' => 'auth_err'
            ]);
        }
        
    }
}
