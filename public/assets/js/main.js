
jQuery(function ($) {

    'use strict';
  
    (function() {
        
        $(document).ready(function () {
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
            var cnt_checked = 0;
            var cur_process = 1;
            var flag_process_end = true;
            var processing = '';

            var modal = '';
            var cat = '';
            var word = '';
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
        });
    }());
});


    