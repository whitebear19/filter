<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Model\Setting;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'name' => 'admin',
            'email' => 'admin@mail.com',
            'role' => '2',            
            'type' => '1',        
            'email_verified_at' => date('Y-m-d H:i:s'),         
            'password' => Hash::make('admin1234'),
        ]);

        User::create([
            'name' => 'userone',
            'email' => 'user@mail.com',
            'role' => '1',  
            'type' => '1',            
            'email_verified_at' => date('Y-m-d H:i:s'),            
            'password' => Hash::make('user1234'),
        ]);
        Setting::create([
            'oasis_enjoy_img' => '',            
            'oasis_headset_img' => '',   
            'oasis_video' => '',                     
        ]);
    }
}
