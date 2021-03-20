@extends('layouts.main')
@section('content')
<div class="row mt-3 text-center" style="font-size: 1.25em;">
    <form action="" class="filter_form" method="get">
        
        <div class="col-md-5 part">
            <h3>Modalidad de Compra!</h3>

            <select multiple="multiple" id="id1" class="SlectBoxModal w-100 required">                
                @foreach ($modal as $item)
                    @php
                        $selected = '';
                    @endphp
                    @if ($set_modal)
                        @for ($i = 0; $i < count($set_modal); $i++)
                            @if ($item->val == $set_modal[$i])
                                @php
                                    $selected = 'selected';                                        
                                @endphp
                            @endif
                        @endfor
                    @endif
                   
                    <option value="{{ $item->val }}" {{ $selected }}>{{ $item->name }}</option>
                @endforeach
            </select>
            <div class="modal_area" style="display: none;">
                                      
            </div>
        </div>
        <div class="col-md-3 part">
            <h3>Categorías Concursos!</h3>
            <select id="id2" multiple="multiple" class="w-100 SlectBoxCat required">
                
                @foreach ($cat as $item)
                    @php
                        $selected = '';
                    @endphp
                    @if ($set_cat)
                        @for ($i = 0; $i < count($set_cat); $i++)
                            @if ($item->val == $set_cat[$i])
                                @php
                                    $selected = 'selected';                                        
                                @endphp
                            @endif
                        @endfor
                    @endif
                    <option value="{{ $item->val }}" {{ $selected }}>{{ $item->name }}</option>
                @endforeach
            </select>
            <div class="cat_area" style="display: none;">
                 
            </div>

        </div>
        <div class="col-md-3 part">
            <h3>Insert your keyword!</h3>
            <input type="text" name='id3' class="SelectWord w-100" value="{{ $set_keyword }}">
        </div>
        <div class="col-md-1 d-flex align-items-end ">
            <button type="button" class="btn btn-dark w-100 btn_filter"> Filter</button>
        </div>
    </form>

    <div class="col-md-12 mt-5 table_filter">
        <div class="mb-3">
            <label for="" style="float: left;" class="mr-3">Result rows:
                <span class="cnt_filter"></span>
            </label>
            <label for="" style="float: left;" class="mr-3">Matched data with the search word:
                <span class="cnt_match"></span>
            </label>
            <label for="" style="float: left;">Latest updated at:
                <span class="latest_updated" style="color: blue;font-weight:bold;"></span>
                (CST)
            </label>
            <button type="button" class="btn_download_file" style="float: right;">Download as csv</button>
            <button class="btn_scrapping" style="float: right;">
                <svg style="width:15px;height:15px;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hammer" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-hammer fa-w-18 fa-3x"><path fill="currentColor" d="M571.31 193.94l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31-28.9-28.9c5.63-21.31.36-44.9-16.35-61.61l-45.25-45.25c-62.48-62.48-163.79-62.48-226.28 0l90.51 45.25v18.75c0 16.97 6.74 33.25 18.75 45.25l49.14 49.14c16.71 16.71 40.3 21.98 61.61 16.35l28.9 28.9-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l90.51-90.51c6.23-6.24 6.23-16.37-.02-22.62zm-286.72-15.2c-3.7-3.7-6.84-7.79-9.85-11.95L19.64 404.96c-25.57 23.88-26.26 64.19-1.53 88.93s65.05 24.05 88.93-1.53l238.13-255.07c-3.96-2.91-7.9-5.87-11.44-9.41l-49.14-49.14z" class=""></path></svg>
                Scraping
            </button>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <td>No</td>                    
                    <td>Product ID</td>                    
                    <td>Start date</td>
                    <td>Deadline</td>
                    <td>Status1</td>
                    <td>Status2</td>   
                    <td>Entity</td>   
                    <td>Sub entity</td>   
                    <td>Category</td>   
                    <td>Product description</td>   
                    <td>Purchage mode</td>
                    <td></td>                
                </tr>
            </thead>
            <tbody class="table_filter_rows">

            </tbody>
        </table>
    </div>
    <div class="col-md-12 mt-5 no_result">
        <p>
            There are no active events today in the categories you've selected
        </p>
    </div>
    <div class="processing_display">
        <label for="" class="processing_display_log"></label>
    </div>
</div>
<form action="{{ route('fileExport') }}" class="d-none form_forfile" method="post">
    @csrf
    <input type="hidden" name="modal" class="forfile_modal" value="">
    <input type="hidden" name="cat" class="forfile_cat" value="">
    <input type="hidden" name="word" class="forfile_word" value="">
</form>
    
   
@endsection
