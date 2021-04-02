<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();
Route::get('/', 'HomeController@index');

Route::get('/filter', 'HomeController@filter')->name('filter')->middleware('auth');
Route::get('/advanced', 'HomeController@advanced')->name('advanced')->middleware('auth');
Route::get('/get_filter', 'HomeController@get_filter');
Route::get('/get_advanced', 'HomeController@get_advanced');
Route::get('/confirm', 'HomeController@confirm')->name('confirm')->middleware('auth');
Route::get('/email/verify/{id}', 'HomeController@verify')->middleware('auth');
Route::get('/resend_link','HomeController@resend_link');
Route::post('/result','HomeController@result')->name('result')->middleware('auth');
Route::post('/scraping','HomeController@scraping')->name('scraping')->middleware('auth');
Route::get('/home', 'HomeController@index')->name('home')->middleware('auth');
Route::get('/download/{id}', 'HomeController@download')->name('download');
Route::post('/file-export', 'HomeController@fileExport')->name('fileExport');
Route::get('/set_todo', 'HomeController@set_todo');
Route::get('/consultakey', 'HomeController@consultakey');
Route::get('/uploaddata', 'HomeController@uploaddata')->middleware('auth');
Route::get('/uploaddata_process', 'HomeController@uploaddata_process');





