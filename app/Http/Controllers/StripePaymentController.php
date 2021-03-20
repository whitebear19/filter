<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Session;
use Stripe;
use Auth;
use App\User;
use App\Model\GameCheck;

class StripePaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function stripePost(Request $request)
    {
        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));         
        $price = $request->get('price');
        try {
            $temp = Stripe\Charge::create ([
                "amount" => 100 * $price,
                "currency" => "eur",
                "source" => $request->stripeToken,
                "description" => "Payment from I-Oasis.fr" 
            ]);
            
            if($temp->status == "succeeded")
            {  
                $user = Auth::user();
                $user->paid = "1";
                $user->company_plan = $request->get('plan');
                $user->save();    

                if($user->paid != "1")
                {
                    $user->paid = "1";
                    if(!empty($request->get('plan')))
                    {
                        $user->company_plan = $request->get('plan');
                    }            
                    $user->save();    
                }

                $rows = GameCheck::where('user_id',Auth::user()->id)->where('paid','0')->get();
                foreach($rows as $item)
                {
                    $item->paid="1";
                    $item->save();
                }
                Session::flash('success', 'Payment successful!');      
                return redirect('/library');
            }
            else
            {
                return back();
            }
            
        }
        catch(Exception $e) {           
            return back()->with("error",$e->getMessage()); 
        }
       
    }
}
