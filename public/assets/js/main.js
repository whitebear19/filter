
jQuery(function ($) {

    'use strict';
  
    (function() {
        
        $(document).ready(function () {
            var cnt_checked = 0;
            var cur_process = 1;
            var flag_process_end = true;
            var processing = '';

            var modal = '';
            var cat = '';
            var word = '';
            var adv_modal = '';
            var adv_cat = '';
            var adv_word = '';
            var adv_date = '';
            var adv_data = '';
            var is_table = false;
            var arr_buyer=[];
            var arr_seller=[];
            var ave_price=[];
            var is_chart = false;
           
            var ave_qty_of_offers = 0;
            var common_unit_of_measurement = '';
            var average_days = 0;
            var average_price = 0;
            var price_std = 0;
            var price_median = 0;
            var price_sharpe_ratio = 0;
            var qty_oprc = 0;

            function checkprocess() {
                if (cur_process < cnt_checked+1) {
                            
                    if(flag_process_end)
                    {
                        flag_process_end = false;                            
                        get_one_row(cur_process);
                    }      
                    else
                    {
                        console.log("Now processing");
                    }           
                }
                else
                {
                    clearTimeout(processing);
                }            
                
            }
            function get_one_row(order)
            {
                console.log(order+"th process started");
                $(".processing_display_log").html(order+"th started process");
                cur_process++;
                            
                var elem = $("input:checked.need_scrapping:eq("+(order-1)+")");
                var word = elem.data('word');
                var url = elem.data('url');
                var pid = elem.data('pid');
                
                console.log(url);
               
                
                if (url.indexOf(pid) >= 0)
                {
                    
                }
                else
                {
                    url = "https://www.guatecompras.gt/concursos/consultaConcurso.aspx?nog="+pid;
                }
                $("#loading").css('display','block');
                
                $.ajax({
                    url: "/consultakey",
                    method: 'get', 
                    data: {word:word,url:url},     
                    success: function(result){    
                        $("#loading").css('display','none');
                        var data = result.result;
                        console.log(result);                        
                        if(result.auth)
                        {
                            console.log("We have sent file download link to your email.Please check your email.");
                            $(".processing_display_log").html("We have sent file download link to your email.Please check your email.");
                        }
                        else if(!result.auth)
                        {
                            console.log("Please login!");
                        }
                        flag_process_end = true;
                    },
                    error: function(jqXHR, exception) {
                        console.log(jqXHR);
                        $("#loading").css('display','none');
                        if (jqXHR.status === 0) {
                            console.log('Not connect.\n Verify Network.');
                        } else if (jqXHR.status == 404) {
                            console.log('Requested page not found. [404]');
                        } else if (jqXHR.status == 500) {
                            console.log('Internal Server Error [500].');
                        } else if (exception === 'parsererror') {
                            console.log('Requested JSON parse failed.');
                        } else if (exception === 'timeout') {
                            console.log('Time out error.');
                        } else if (exception === 'abort') {
                            console.log('Ajax request aborted.');
                        } else {
                            console.log('Uncaught Error.\n' + jqXHR.responseText);
                        }
                        $(".processing_display_log").html("Something wrong!");
                        flag_process_end = true;
                    }
                })
            }
            function format_chart()
            {
                $("#chart_buyer").html("");
                $("#chart_seller").html("");                
                $(".wrap_chart").css("display","none");
                arr_buyer=[];
                arr_seller=[];
                ave_price=[];
                ave_qty_of_offers = 0;
                common_unit_of_measurement = '';
                average_days = 0;
                average_price = 0;
                price_std = 0;
                price_median = 0;
                price_sharpe_ratio = 0;
                qty_oprc = 0;
            }
            function get_common_unit_of_measurement()
            {
                var value = '';
                var common_unit_of_measurement = [];
                for (let index = 0; index < adv_data.length; index++) 
                { 
                    var is_valid = true;
                    var unit_of_measurement = adv_data[index].unit_of_measurement;
                    if(common_unit_of_measurement.length>0)
                    {
                        for(let k = 0; k < common_unit_of_measurement.length; k++)
                        {
                            var unit_of_measurement
                            if(common_unit_of_measurement[k].unit_of_measurement == unit_of_measurement)
                            {
                                is_valid = false;
                                break;
                            }
                        }  
                    }
                    if(is_valid)
                    {
                        
                        var temp = {unit_of_measurement:adv_data[index].unit_of_measurement,cnt:0};
                        common_unit_of_measurement.push(temp);                     
                    }
                }
                if(common_unit_of_measurement.length>0)
                {
                    for(let k = 0; k < common_unit_of_measurement.length; k++)
                    {
                        var cnt = 0;
                        for (let index = 0; index < adv_data.length; index++) 
                        { 
                            if(common_unit_of_measurement[k].unit_of_measurement == adv_data[index].unit_of_measurement)
                            {
                                cnt += 1;
                            }
                        }
                        common_unit_of_measurement[k].cnt = cnt;
                    } 
                    var temp = parseInt(common_unit_of_measurement[0].cnt);
                    value = common_unit_of_measurement[0].cnt + " : " + common_unit_of_measurement[0].unit_of_measurement;
                    for(let k = 0; k < common_unit_of_measurement.length; k++)
                    {                        
                        if(temp<parseInt(common_unit_of_measurement[k].cnt))
                        {
                            temp = parseInt(common_unit_of_measurement[k].cnt);
                            value = common_unit_of_measurement[k].cnt + " : " + common_unit_of_measurement[k].unit_of_measurement;
                        }
                    } 
                }
                return value;
            }
            function get_average_price()
            {
                var value = 0;
                if(ave_price.length>0)
                {
                    for(let kk = 0; kk < ave_price.length; kk++)
                    {
                        value = value + parseFloat(ave_price[kk]);
                    }  
                    average_price = (value/ave_price.length).toFixed(3);
                }
            }
            function get_data_statistics()
            {
                for (let index = 0; index < adv_data.length; index++) 
                {  
                    if (parseFloat(adv_data[index].qty_sum)>0) 
                    {
                        var temp_ave_price = Math.round(parseFloat(adv_data[index].amount)/parseFloat(adv_data[index].qty_sum));
                    } 
                    else
                    {
                        var temp_ave_price = 0;
                    }
                    ave_price.push(temp_ave_price);
                    ave_qty_of_offers = ave_qty_of_offers + parseInt(adv_data[index].qty_of_offers);
                }
                if(ave_price.length>1)
                {
                    for(let kk = 0; kk < ave_price.length-1; kk++)
                    {
                        var max_val = parseFloat(ave_price[kk]);
                        for(let jj = kk+1; jj < ave_price.length; jj++)
                        {
                            if(parseFloat(ave_price[jj]) > max_val)
                            {
                                max_val = ave_price[jj];
                                var temp = ave_price[jj];
                                ave_price[jj] = ave_price[kk];
                                ave_price[kk] = temp;                     
                            }
                        }
                    }  
                }
                console.log("ave_price:");
                console.log(ave_price);
                ave_qty_of_offers = (ave_qty_of_offers/adv_data.length).toFixed(3);
                common_unit_of_measurement = get_common_unit_of_measurement();
                get_average_price();

                if(ave_price.length>0)
                {
                    for(let i=0;i<ave_price.length;i++)
                    {
                        var item = Math.abs(parseFloat(ave_price[i])-parseFloat(average_price));
                        price_std = price_std + item*item;
                    }
                    price_std = (Math.sqrt(price_std/ave_price.length)).toFixed(3);
                }
                if ( ave_price.length % 2 == 0) 
                {
                    var index = ave_price.length/2;
                    price_median = (ave_price[index] + ave_price[index+1])/2;
                }
                else
                {
                    var index = Math.round(ave_price.length/2);
                    price_median = ave_price[index];
                }
                price_sharpe_ratio = (average_price/price_std).toFixed(3);
                $(".ave_qty_of_offers").html(ave_qty_of_offers);
                $(".common_unit_of_measurement").html(common_unit_of_measurement);
                $(".average_days").html(average_days);
                $(".average_price").html(average_price);
                $(".price_std").html(price_std);
                $(".price_median").html(price_median);
                $(".price_sharpe_ratio").html(price_sharpe_ratio);
                $(".qty_oprc").html(qty_oprc);
            }
            function get_data_for_buyer()
            {
                for (let index = 0; index < adv_data.length; index++) 
                {                      
                      
                    var buyer_entity = adv_data[index].buyer_entity;
                    var buyer_sub_entity = adv_data[index].buyer_sub_entity;
                    var amount = parseFloat(adv_data[index].amount);
                    var is_valid = true;

                    if(arr_buyer.length>0)
                    {
                        for(let k = 0; k < arr_buyer.length; k++)
                        {
                            if(arr_buyer[k].buyer_entity == buyer_entity && arr_buyer[k].buyer_sub_entity == buyer_sub_entity)
                            {
                                is_valid = false;
                                break;
                            }
                        }  
                    }
                    if(is_valid)
                    {
                        for (let j = index+1; j < adv_data.length; j++) 
                        {  
                            if(buyer_entity == adv_data[j].buyer_entity)
                            {
                                if(buyer_sub_entity == adv_data[j].buyer_sub_entity)
                                {                                    
                                    amount = amount + parseFloat(adv_data[j].amount); 
                                }
                            }
                        }    
                        var arr_temp = {buyer_entity:adv_data[index].buyer_entity,buyer_sub_entity:adv_data[index].buyer_sub_entity,amount:Math.round(amount)};
                        arr_buyer.push(arr_temp);                     
                    }
                    
                }
                
                if(arr_buyer.length>0)
                {
                    for(let kk = 0; kk < arr_buyer.length-1; kk++)
                    {
                        var max_val = arr_buyer[kk].amount;
                        for(let jj = kk+1; jj < arr_buyer.length; jj++)
                        {
                            if(arr_buyer[jj].amount > max_val)
                            {
                                max_val = arr_buyer[jj].amount;
                                var temp_amount = arr_buyer[jj].amount;
                                arr_buyer[jj].amount = arr_buyer[kk].amount;
                                arr_buyer[kk].amount = temp_amount;
                                var temp_buyer_entity = arr_buyer[jj].buyer_entity;
                                arr_buyer[jj].buyer_entity = arr_buyer[kk].buyer_entity;
                                arr_buyer[kk].buyer_entity = temp_buyer_entity;
                                var temp_buyer_sub_entity = arr_buyer[jj].buyer_sub_entity;
                                arr_buyer[jj].buyer_sub_entity = arr_buyer[kk].buyer_sub_entity;
                                arr_buyer[kk].buyer_sub_entity = temp_buyer_sub_entity;
                            }
                        }  
                        
                    }  
                }
                console.log(arr_buyer);
                              
                

                var display_buyer = [];
                for(let yy = 0;yy<10;yy++)
                {
                    var temp = {buyer_entity:"",buyer_sub_entity:"",amount:0};
                    display_buyer.push(temp);
                }
                for(let i = 0;i<arr_buyer.length;i++)
                {
                    if(i<10)
                    {
                        display_buyer[i].buyer_entity = arr_buyer[i].buyer_entity;
                        display_buyer[i].buyer_sub_entity = arr_buyer[i].buyer_sub_entity;
                        display_buyer[i].amount = arr_buyer[i].amount;
                    }
                    else
                    {
                        break;
                    }
                   
                }
                var pie = new d3pie("chart_buyer", {
                    header: {
                        title: {
                            text: "Top buyers",
                            fontSize: 24,
                            y:0
                        }
                    },
                    size: {
                        pieOuterRadius: "80%",
                        canvasHeight: 500
                    },
                    data: {
                        content: [
                            { label: display_buyer[0].buyer_entity + " " + display_buyer[0].buyer_sub_entity, value: display_buyer[0].amount },
                            { label: display_buyer[1].buyer_entity + " " + display_buyer[1].buyer_sub_entity, value: display_buyer[1].amount },
                            { label: display_buyer[2].buyer_entity + " " + display_buyer[2].buyer_sub_entity, value: display_buyer[2].amount },
                            { label: display_buyer[3].buyer_entity + " " + display_buyer[3].buyer_sub_entity, value: display_buyer[3].amount },
                            { label: display_buyer[4].buyer_entity + " " + display_buyer[4].buyer_sub_entity, value: display_buyer[4].amount },
                            { label: display_buyer[5].buyer_entity + " " + display_buyer[5].buyer_sub_entity, value: display_buyer[5].amount },
                            { label: display_buyer[6].buyer_entity + " " + display_buyer[6].buyer_sub_entity, value: display_buyer[6].amount },
                            { label: display_buyer[7].buyer_entity + " " + display_buyer[7].buyer_sub_entity, value: display_buyer[7].amount },
                            { label: display_buyer[8].buyer_entity + " " + display_buyer[8].buyer_sub_entity, value: display_buyer[8].amount },
                            { label: display_buyer[9].buyer_entity + " " + display_buyer[9].buyer_sub_entity, value: display_buyer[9].amount }
                        ]
                    },
                    misc: {
                        colors: {
                            segments: [
                                "#c9c9c9", "#eee5f1", "#d7d5e8", "#b4c4df", "#84b2d4", "#519ec8", "#258bae", "#027c7e", "#016755", "#014636"
                            ]
                        }
                    }
                });
                $("#p0_title").attr("y","0");
            }

            function get_data_for_seller()
            {
                for (let index = 0; index < adv_data.length; index++) 
                {                      
                      
                    var seller = adv_data[index].seller;
                   
                    var amount = parseFloat(adv_data[index].amount);
                    var is_valid = true;

                    if(arr_seller.length>0)
                    {
                        for(let k = 0; k < arr_seller.length; k++)
                        {
                            if(arr_seller[k].seller == seller)
                            {
                                is_valid = false;
                                break;
                            }
                        }  
                    }
                    if(is_valid)
                    {
                        for (let j = index+1; j < adv_data.length; j++) 
                        {  
                            if(seller == adv_data[j].seller)
                            {                                                          
                                amount = amount + parseFloat(adv_data[j].amount);                                 
                            }
                        }    
                        var arr_temp = {seller:adv_data[index].seller,amount:Math.round(amount)};
                        arr_seller.push(arr_temp);                     
                    }
                    
                }
                
                if(arr_seller.length>0)
                {
                    for(let kk = 0; kk < arr_seller.length-1; kk++)
                    {
                        var max_val = arr_seller[kk].amount;
                        for(let jj = kk+1; jj < arr_seller.length; jj++)
                        {
                            if(arr_seller[jj].amount > max_val)
                            {
                                max_val = arr_seller[jj].amount;
                                var temp_amount = arr_seller[jj].amount;
                                arr_seller[jj].amount = arr_seller[kk].amount;
                                arr_seller[kk].amount = temp_amount;
                                var temp_seller = arr_seller[jj].seller;
                                arr_seller[jj].seller = arr_seller[kk].seller;
                                arr_seller[kk].seller = temp_seller;
                            }
                        }  
                        
                    }  
                }
                console.log(arr_seller);
                                
                var display_seller = [];
                for(let yy = 0;yy<10;yy++)
                {
                    var temp = {seller:"",amount:0};
                    display_seller.push(temp);
                }
                for(let i = 0;i<arr_seller.length;i++)
                {
                    if(i<10)
                    {
                        display_seller[i].seller = arr_seller[i].seller;
                        display_seller[i].amount = arr_seller[i].amount;
                    }
                    else
                    {
                        break;
                    }
                   
                }
                var pie = new d3pie("chart_seller", {
                    header: {
                        title: {
                            text: "Top sellers",
                            fontSize: 24,
                            y:0
                        }
                    },
                    size: {
                        pieOuterRadius: "80%",
                        canvasHeight: 500
                    },
                    data: {
                        content: [
                            { label: display_seller[0].seller, value: display_seller[0].amount },
                            { label: display_seller[1].seller, value: display_seller[1].amount },
                            { label: display_seller[2].seller, value: display_seller[2].amount },
                            { label: display_seller[3].seller, value: display_seller[3].amount },
                            { label: display_seller[4].seller, value: display_seller[4].amount },
                            { label: display_seller[5].seller, value: display_seller[5].amount },
                            { label: display_seller[6].seller, value: display_seller[6].amount },
                            { label: display_seller[7].seller, value: display_seller[7].amount },
                            { label: display_seller[8].seller, value: display_seller[8].amount },
                            { label: display_seller[9].seller, value: display_seller[9].amount }
                        ]
                    },
                    misc: {
                        colors: {
                            segments: [
                                "#c9c9c9", "#eee5f1", "#d7d5e8", "#b4c4df", "#84b2d4", "#519ec8", "#258bae", "#027c7e", "#016755", "#014636"
                            ]
                        }
                    }
                });

            }

            function display_advanced()
            {
                if(is_table)
                {
                    $('#table_advanced').DataTable().destroy();
                }
                $(".table_advanced_rows").html(""); 
                var cnt_match = 0;                               
                $(".cnt_filter").html(adv_data.length);
                $("#table_advanced_W").css('display','block');
                $(".wrap_chart").css('display','block');
                $(".no_result").css("display","none");
                for (let index = 0; index < adv_data.length; index++) {
                    var html=`
                        <tr>
                            <td>${index+1}</td>                    
                            <td>${adv_data[index].nog}</td>                    
                            <td>${adv_data[index].start_date}</td>
                            <td>${adv_data[index].end_date}</td>
                            <td>${adv_data[index].modality}</td>
                            <td>${adv_data[index].category}</td>   
                            <td>${adv_data[index].event_description}</td>   
                            <td>${adv_data[index].buyer_entity}</td>   
                            <td>${adv_data[index].buyer_sub_entity}</td>   
                            <td>${adv_data[index].seller}</td>   
                            <td>${adv_data[index].qty_of_offers}</td>
                            <td>${adv_data[index].amount}</td>                
                            <td>${adv_data[index].qty}</td>                
                            <td>${adv_data[index].unit_of_measurement}</td>                
                            <td>${adv_data[index].qty_sum}</td>                
                            <td>${adv_data[index].bigger_than}</td>                
                            <td>
                                <input type="checkbox" class="need_remove" value="${index}">
                            </td>                
                        </tr>
                    `;   
                    $(".table_advanced_rows").append(html);                
                }
                
                
                
                $(".cnt_match").html(cnt_match); 
                
                $('#table_advanced').DataTable();                
                
                if(!is_table)
                {
                    is_table = true;
                }
                console.log(adv_data);
            }
            
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $('.scrap_start').on('click',function(e){
                $('body').loadingModal({ text: 'Loading...' });
                var item=($(this).parents()).siblings('td');
                var id=item[1].innerHTML;
                var check=item[0].firstChild
                console.log(check);
                var keyword=$('input[name="id3"]').val();
                console.log(id);
                $.ajax({
                    url: "/scraping",
                    method: 'POST', 
                    data: {id:id,keyword:keyword},     
                    success: function(result){    

                        // var delay = function(ms) { return new Promise(function(r) { setTimeout(r, ms) }) };
                        // var time = 5000;
                        // delay(time)
                        //     .then(function() { $('body').loadingModal('color', 'black').loadingModal('text', 'Done :-)').loadingModal('backgroundColor', 'yellow'); return delay(time); })
                        //     .then(function() { $('body').loadingModal('hide'); return delay(time); })
                        //     .then(function() { $('body').loadingModal('destroy'); });
                        // window.location = url + "home";
                        check.checked = true; 
                        $('body').loadingModal('hide');
                    }
                })
            });

            window.asd = $('.SlectBoxModal').SumoSelect({ csvDispCount: 3, selectAll:true, captionFormatAllSelected: "Selected all." });
            $('.SlectBoxModal').on('sumo:opened', function(o) {
            console.log("dropdown opened", o)
            });
            window.asd = $('.SlectBoxCat').SumoSelect({ csvDispCount: 3, selectAll:true, captionFormatAllSelected: "Selected all." });
            $('.SlectBoxCat').on('sumo:opened', function(o) {
            console.log("dropdown opened", o)
            });

            $(document).on('click','.btn_download_file',function(){
                
                $(".forfile_modal").val(modal);
                $(".forfile_cat").val(cat);
                $(".forfile_word").val(word);
                $(".form_forfile").submit();
            });

            $(document).on('click','.btn_filter',function(){     
                
                                
                var is_check = true;                  
                $(".required").each(function(){
                    if($(this).val()=="")
                    {                        
                        is_check = false;
                    }
                });
                
                if(is_check)
                {
                    modal = $('.SlectBoxModal').val();
                    cat = $('.SlectBoxCat').val();
                    word = $('.SelectWord').val();

                    $("#loading").css('display','block');
                    $(".table_filter").css('display','none');
                    $(".cnt_filter").html('');
                    $.ajax({
                        url: "/get_filter",
                        method: 'get', 
                        data: {modal:modal,cat:cat,word:word},     
                        success: function(result){    
                            $("#loading").css('display','none');
                            $(".cnt_match").html(""); 
                            $(".latest_updated").html("");
                            var data = result.result;
                            var latest_updated = result.latest_updated;                            
                            console.log(result);                           
                            $(".table_filter_rows").html("");  
                            if(data.length>0)
                            {
                                var cnt_match = 0;
                                $(".latest_updated").html(latest_updated);
                                $(".cnt_filter").html(data.length);
                                $(".table_filter").css('display','block');
                                $(".no_result").css("display","none");
                                for (let index = 0; index < data.length; index++) {
                                    var description = data[index].k;
                                    description = description.split("||");

                                    var html = `
                                        <tr`;
                                            if(data[index].word == "ok")
                                            {
                                               html +=" class='selected_row'";
                                               cnt_match += 1;
                                            }
                                        
                                        html +=`
                                        >
                                            <td>${index+1}</td>                                            
                                            <td>${data[index].a}</td>                                            
                                            <td>${data[index].b}</td>
                                            <td>${data[index].c}</td>
                                            <td>${data[index].d}</td>
                                            <td>${data[index].e}</td>
                                            <td>${data[index].h}</td>
                                            <td>${data[index].i}</td>
                                            <td>${data[index].j}</td>
                                            <td>${description[0]}</td>
                                            <td>${data[index].m}</td>
                                            <td>
                                            `;
                                            var keyword = '';
                                            var url = description[1];
                                            if(data[index].word == "ok")
                                            {
                                                var array = word.split(",");
                                                for (var i=0;i<array.length;i++){
                                                    if((description[0].indexOf(array[i]) >= 0))
                                                    {
                                                        keyword = array[i];
                                                        break;
                                                    }
                                                }
                                                
                                            }
                                            html +=`                                                    
                                                    <input type="checkbox" class="need_scrapping" data-word="${keyword}" data-url="${url}" data-pid="${data[index].a}">
                                                `;
                                            
                                        html +=`
                                            
                                            </td>
                                            
                                        </tr>
                                    `;
                                            
                                    $(".table_filter_rows").append(html);                                
                                }
                                
                                $(".cnt_match").html(cnt_match); 
                            }   
                            else
                            {
                                $(".table_filter").css('display','none');                               
                                $(".no_result").css("display","block");
                            }  
                            
                        },
                        error: function(jqXHR, exception) {
                            $("#loading").css('display','none');
                            if (jqXHR.status === 0) {
                                alert('Not connect.\n Verify Network.');
                            } else if (jqXHR.status == 404) {
                                alert('Requested page not found. [404]');
                            } else if (jqXHR.status == 500) {
                                alert('Internal Server Error [500].');
                            } else if (exception === 'parsererror') {
                                alert('Requested JSON parse failed.');
                            } else if (exception === 'timeout') {
                                alert('Time out error.');
                            } else if (exception === 'abort') {
                                alert('Ajax request aborted.');
                            } else {
                                alert('Uncaught Error.\n' + jqXHR.responseText);
                            }
                        }
                    })
                }
                else
                {
                    alert("Please input filter value.");
                }
            });
            $(document).on('click','.btn_scrapping',function()
            {
                cur_process = 1;
                cnt_checked = 0;
                
                $("input:checked.need_scrapping").each(function(){                        
                    cnt_checked++;           
                });
                if(cnt_checked<1)
                {
                    alert("You have to check one row at least!");
                    return false;
                }
                else
                {
                    processing = setInterval(checkprocess, 1000);
                }
                
            })
            $(document).click(function(){                
                $(".processing_display_log").html("");
            });

            $(document).on('click','.btn_adv_filter',function(){  
                var is_check = true;                  
                is_chart = false;              
                if(is_check)
                {
                    adv_modal = $('.SlectBoxModal').val();
                    adv_cat = $('.SlectBoxCat').val();
                    adv_word = $('.SelectWord').val();
                    adv_date = $('.SelectDate').val();
                    
                    $("#loading").css('display','block');
                    $("#table_advanced_W").css('display','none');
                    $(".cnt_filter").html('');
                    adv_data = '';
                    $.ajax({
                        url: "/get_advanced",
                        method: 'get', 
                        data: {modal:adv_modal,cat:adv_cat,word:adv_word,date:adv_date},     
                        success: function(result){    
                            $("#loading").css('display','none');
                            $(".cnt_match").html("");                             
                            adv_data = result.result;
                                                                                               
                             
                            if(adv_data.length>0)
                            {
                                display_advanced();
                            }   
                            else
                            {

                                $(".table_advanced_rows").html(""); 
                                $("#table_advanced_W").css('display','none'); 
                                $(".wrap_chart").css('display','none');                                                               
                                $(".no_result").css("display","block");
                            } 
                            if(!result.auth)
                            {
                                location.reload();
                            }
                            
                        },
                        error: function(jqXHR, exception) {
                            $("#loading").css('display','none');
                        }
                    })
                }
                else
                {
                    alert("Please input filter value.");
                }
                format_chart();
            });
            $(document).on('click','.btn_remove_rows',function(){
                var removeValFromIndex = []; 
                is_chart = false;   
                $(".need_remove").each(function(){
                    if($(this).prop('checked'))
                    {                        
                        removeValFromIndex.push($(this).val());                        
                    }
                    
                });                
                                   

                for (var i = removeValFromIndex.length -1; i >= 0; i--)
                    adv_data.splice(removeValFromIndex[i],1);
                console.log(adv_data);
                
                if(adv_data.length>0)
                {
                    display_advanced();
                }   
                else
                {

                    $(".table_advanced_rows").html(""); 
                    $("#table_advanced_W").css('display','none');                               
                    $(".no_result").css("display","block");
                }  
                format_chart();
            });

            $(document).on('click','.btn_clear_date',function(){
                $("input[name='id0']").val("");
            });
            $(document).on('click','.btn_make_calculations',function(){
                if(!is_chart)
                {
                    get_data_for_buyer();
                    get_data_for_seller();
                    get_data_statistics();
                    is_chart = true;
                }                
            });
        });
    }());
});


    