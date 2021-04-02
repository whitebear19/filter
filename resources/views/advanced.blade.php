@extends('layouts.main')
@section('content')
<form action="" class="filter_form" method="get">
    <div class="mt-3 text-center" style="font-size: 1.25em;width:100%; border: 1px solid #3ea9f5;padding-bottom:10px;border-radius:5px;">        
        <div class="advanced_filter_wrap">            
            <div class="advanced_filter">
                <h3>Date</h3>
                <div style="position: relative;">
                    <input type="text" name='id0' class="SelectDate w-100" value="{{ $set_date }}" style="padding-left:5px;padding-right:15px;">
                    <button class="btn_clear_date" type="button">
                        <svg aria-hidden="true" style="width: 20px;height:20px;" focusable="false" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-3x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg>
                    </button>
                </div>                
            </div>
            <div class="advanced_filter">
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
            <div class="advanced_filter">
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
            <div class="advanced_filter">
                <h3>Insert your keyword!</h3>
                <input type="text" name='id3' class="SelectWord w-100" value="{{ $set_keyword }}">
            </div>
        </div>   
        <div class="row">                    
            <div class="col-md-3"></div>
            <div class="col-md-3"></div>
            <div class="col-md-3">
                <button type="button" class="btn btn_remove_rows">Remove Selected Rows</button>
            </div>
            <div class="col-md-3">
                <button type="button" class="btn btn_adv_filter">Filter</button>
            </div>
        </div>
    </div>
    
</form>
<div class="row">
    <div class="col-md-12 mt-5 table_filtera">
        <div class="mb-3">
            <label for="" style="float: left;" class="mr-3">Result rows:
                <span class="cnt_filter"></span>
            </label> 
        </div>
        <div id="table_advanced_W">
            <table class="table" id="table_advanced">
                <thead>
                    <tr>
                        <td>No</td>                    
                        <td>NOG</td>                    
                        <td>Start date</td>
                        <td>End date</td>
                        <td>Modality</td>
                        <td>Category</td>   
                        <td>Event description</td>   
                        <td>Buyer entity</td>   
                        <td>Buyer sub entity</td>   
                        <td>Seller</td>   
                        <td>Qty of offers</td>
                        <td>Amount</td>                
                        <td>Qty</td>                
                        <td>Unit of measurement</td>                
                        <td>Qty sum</td>                
                        <td>Bigger than</td>                
                        <td></td>                
                    </tr>
                </thead>
                <tbody class="table_filter_rows table_advanced_rows">
                    
                </tbody>
            </table>
        </div>
        
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
<div class="row">
    <div class="col-md-12">
        <div class="wrap_chart">
            <div class="text-center">
                <button class="btn_make_calculations">Make calculations</button>
            </div>
            <div>
                <div class="summary_statistics">
                    <div>
                        <h3>Summary Statistics</h3>
                        <div class="form-group">
                            <label for="" class="summary_label">Average qty of offers:</label>
                            <span class="summary_item ave_qty_of_offers"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Common unit of measurement:</label>
                            <span class="summary_item common_unit_of_measurement"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Average days:</label>
                            <span class="summary_item average_days"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Average price:</label>
                            <span class="summary_item average_price"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Price std:</label>
                            <span class="summary_item price_std"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Price median:</label>
                            <span class="summary_item price_median"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Price sharpe ratio:</label>
                            <span class="summary_item price_sharpe_ratio"></span>
                        </div>
                        <div class="form-group">
                            <label for="" class="summary_label">Qty offers-price ranking correlation:</label>
                            <span class="summary_item qty_oprc"></span>
                        </div>
                    </div>
                </div>
                <div class="chart_buyer_wrap mt-5 chart_height">
                    <div id="chart_buyer" style="text-align: center;">

                    </div>
                </div>
                <div class="chart_seller_wrap mt-5 chart_height">
                    <div id="chart_seller" style="text-align: center;">

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<form action="{{ route('fileExport') }}" class="d-none form_forfile" method="post">
    @csrf
    <input type="hidden" name="modal" class="forfile_modal" value="">
    <input type="hidden" name="cat" class="forfile_cat" value="">
    <input type="hidden" name="word" class="forfile_word" value="">
</form>
    
   <script>
       $(document).ready(function () {
            $('input[name="id0"]').daterangepicker();
       });
      
   </script>
@endsection
