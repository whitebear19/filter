
jQuery(function ($) {

    'use strict';
    var postImage = [];
    var postImagesub = [];
// ----------------------------------------------------------------

    (function () {
      var file = document.getElementById('mainImage');
      var fileExtension = ['jpeg', 'jpg', 'png', 'svg', 'gif'];
      var videofileExtension = ['mp4', 'avi'];
      var max_file_number = 10;
      var max_file_number_sub = 10;
      
      $("#mainImage").change(function() 
      {
          var cur_file_number = 0; 
          var available_number = 0;
          $(".upload_post_image_item").each(function(){
              cur_file_number++;
          })
          available_number = max_file_number - cur_file_number;
          var total_file_num = 0;
          var temp_con = 0;
          total_file_num = this.files.length;
          if(total_file_num > available_number)
          {
              if(available_number < 1)
              {
                  alert("Maximum 10 photos allowed !");                    
              }
              else
              {
                  alert("You can upload maximum "+ available_number +" photos!");
              }
              
              return false;
          }
          for (let index = 0; index < this.files.length; index++) {

              if (this.files && this.files[index]) 
              {   
                  if(this.files[index].size > 100000000)
                  {
                      alert("File size should not exceed 100mb !");
                      return false;
                  }
              }
          }            
          var fileExtension = ['jpeg', 'jpg', 'png', 'svg', 'gif', 'mp4', 'avi'];
         
          for (let index = 0; index < this.files.length; index++) {

              if (this.files && this.files[index]) 
              {                    
                  if ($.inArray(this.files[index]['name'].split('.').pop().toLowerCase(), fileExtension) == -1) {
                      alert("Only formats are allowed : "+fileExtension.join(', '));
                      $("#mainImage").val("");
                      return false;
                  }
                  if(this.files[index].size > 100000000)
                  {
                      alert("File size should be less than 100Mb.");
                      return false;
                  }
                  var formdata = new FormData;
                  formdata.append('postimg',this.files[index]);
                  formdata.append('_token',$('input[name=_token]').val());    
                  $("#loading").css("display","block");          
                  $.ajax({
                      url: "/postimgupload",
                      data: formdata,
                      dataType: "json",
                      type: "post",
                      processData: false,
                      contentType: false,
                      success: function(data){
                          postImage.push(data);
                          var ext = data.split(".")[1];
                          
                          let html = '';
                          html += '<li class="upload_post_image_item">';
                          html += '<div class="pos_rel game_img_wrap">';
                          html += '<button type="button" class="btn_transparent btn_post_img_delete" data-value="'+ data +'"><i class="fa fa-times text-color-red"></i></button>';
                          if($.inArray(ext, videofileExtension) == -1 )
                          {
                            html += '<img class="uploaded_game_image" src="/public/upload/game/';
                            html += data;
                            html += '" alt="">';
                          }
                          else
                          {
                            html += '<video class="uploaded_game_image" src="/public/upload/game/'+data+'" controls></video>';                            
                          }
                          html += '</div>';
                          html += '<input name="image_name[]" type="hidden" value="';
                          html += data;
                          html += '">';
                          html += '</li>';
                          $(".upload_post_image").append(html);                     
                          temp_con++;
                          if(temp_con == total_file_num)
                          {
                            $("#loading").css("display","none");                                                        
                          }
                      }
                  });                    
              }
          }
          
      }); 


      $("#subImage").change(function() 
      {
          var cur_file_number = 0; 
          var available_number = 0;
          $(".upload_post_image_item_sub").each(function(){
              cur_file_number++;
          })
          available_number = max_file_number_sub - cur_file_number;
          var total_file_num = 0;
          var temp_con = 0;
          total_file_num = this.files.length;
          if(total_file_num > available_number)
          {
              if(available_number < 1)
              {
                  alert("Maximum 10 photos allowed !");                    
              }
              else
              {
                  alert("You can upload maximum "+ available_number +" photos!");
              }
              
              return false;
          }
          for (let index = 0; index < this.files.length; index++) {

              if (this.files && this.files[index]) 
              {   
                  if(this.files[index].size > 100000000)
                  {
                      alert("File size should not exceed 100mb !");
                      return false;
                  }
              }
          }            
          
          var fileExtension = ['jpeg', 'jpg', 'png', 'svg', 'gif', 'mp4', 'avi'];
          for (let index = 0; index < this.files.length; index++) {

              if (this.files && this.files[index]) 
              {                    
                  if ($.inArray(this.files[index]['name'].split('.').pop().toLowerCase(), fileExtension) == -1) {
                      alert("Only formats are allowed : "+fileExtension.join(', '));
                      $("#mainImage").val("");
                      return false;
                  }
                  if(this.files[index].size > 100000000)
                  {
                      alert("File size should be less than 100Mb.");
                      return false;
                  }
                  var formdata = new FormData;
                  formdata.append('postimg',this.files[index]);
                  formdata.append('_token',$('input[name=_token]').val());    
                  $("#loading").css("display","block");          
                  $.ajax({
                      url: "/postimguploadsub",
                      data: formdata,
                      dataType: "json",
                      type: "post",
                      processData: false,
                      contentType: false,
                      success: function(data){
                          postImagesub.push(data);
                          var ext = data.split(".")[1];
                          let html = '';
                          html += '<li class="upload_post_image_item_sub">';
                          html += '<div class="pos_rel game_img_wrap">';
                          html += '<button type="button" class="btn_transparent btn_post_img_delete_sub" data-value="'+ data +'"><i class="fa fa-times text-color-red"></i></button>';

                          if($.inArray(ext, videofileExtension) == -1 )
                          {
                            html += '<img class="uploaded_game_image" src="/public/upload/game/';
                            html += data;
                            html += '" alt="">';
                          }
                          else
                          {
                            html += '<video class="uploaded_game_image" src="/public/upload/game/'+data+'" controls></video>';                            
                          }
                          
                          html += '</div>';
                          html += '<input name="image_name_sub[]" type="hidden" value="';
                          html += data;
                          html += '">';
                          html += '</li>';
                          $(".upload_post_image_sub").append(html);                     
                          temp_con++;
                          if(temp_con == total_file_num)
                          {
                            $("#loading").css("display","none");                                                        
                          }
                      }
                  });                    
              }
          }
          
      }); 


      $(".select_sortby").change(function() 
      {
        $(".form_select_sortby").submit();       
      }); 
      
      $('.select_payment').on('change', function() {
        var which = $(this).val();
        if(which == "1")
        {
          $(".pay_stripe").css("display","none");
          $(".pay_paypal").fadeIn("slow");
        } 
        else if(which == "2")
        {
          $(".pay_paypal").css("display","none");
          $(".pay_stripe").fadeIn("slow");
        }
     });
      $(document).on('click','.btn_subscribe_now',function(){
        
        $(".section_plan").css("display","none");
        $(".section_pay").fadeIn("slow");
        var price = $(this).data('price');
        var plan = $(this).data('plan');
        $(".pay_price").val(price);
        $(".pay_plan").val(plan);
        $(".btn_pay_now_price").html(price);
      });
      $(document).on('click','.btn_resend_link',function(){
        $("#loading").css("display","block"); 
        $.ajax({
          url: "/resend_link",          
          dataType: "json",
          type: "get",
          success: function(data){ 
              $("#loading").css("display","none"); 
              location.reload();
          }
        });
      });
      



      $(document).on('click','.btn_clear_filter_condition',function(){
        var id=$(this).data('id');
        var type=$(this).data('type');
        if(type == '1')
        {
          $('.gid_'+id).remove();
        }
        else if(type == '2')
        {
          $('.hid_'+id).remove();
        }
        $(".form_select_sortby").submit();
      });
      $(document).on('click','.btn_select_filter',function(){       
        var id=$(this).data('id');
        var type=$(this).data('type');
        if(type=="1")
        {
          $(".gid").remove();
          var html = '<input type="hidden" class="gid gid_'+id+'" value="'+id+'" name="gid[]">';
          $(".form_select_sortby").append(html);
        }
        else if(type=="2")
        {          
          if($('input.hid_'+id).length < 1)
          {
            var html = '<input type="hidden" class="hid_'+id+'" value="'+id+'" name="hid[]">';
            
          }          
          $(".form_select_sortby").append(html);
        }        
        $(".form_select_sortby").submit();
      });
       
      $("#fileCompatibleBtn").change(function() 
      {
          
          for (let index = 0; index < this.files.length; index++) {

              if (this.files && this.files[index]) 
              {   
                  if(this.files[index].size > 10000000)
                  {
                      alert("File size should not exceed 10mb !");
                      return false;
                  }
              }
          }            
          
         
          for (let index = 0; index < this.files.length; index++) {

              if (this.files && this.files[index]) 
              {                    
                  if ($.inArray(this.files[index]['name'].split('.').pop().toLowerCase(), fileExtension) == -1) {
                      alert("Only formats are allowed : "+fileExtension.join(', '));
                      $("#mainImage").val("");
                      return false;
                  }
                  if(this.files[index].size > 2000000)
                  {
                      alert("File size should be less than 2Mb.");
                      return false;
                  }
                  var formdata = new FormData;
                  formdata.append('postimg',this.files[index]);
                  formdata.append('_token',$('input[name=_token]').val());    
                  $("#loading").css("display","block");
                  $(".preview_compatible_img").html("");          
                  $.ajax({
                      url: "/upload_compatible_img",
                      data: formdata,
                      dataType: "json",
                      type: "post",
                      processData: false,
                      contentType: false,
                      success: function(data){
                          
                          let html = '';
                          html += '<img src="/public/upload/game/compatible/'+data+'" class="preview_compatible_img_uploaded" alt="">';
                          html += '<input type="hidden" class="input_uploaded_img_name" value="'+data+'">'
                          $(".preview_compatible_img").append(html);
                          $("#loading").css("display","none");                                                        
                          
                      }
                  });                    
              }
          }
          
      }); 
      
      $(".editsetting").change(function() 
      {    
        for (let index = 0; index < this.files.length; index++) {

            if (this.files && this.files[index]) 
            {  
                var formdata = new FormData;
                formdata.append('postimg',this.files[index]);
                formdata.append('type',$(this).data('type'));
                formdata.append('_token',$('input[name=_token]').val());    
                $("#loading").css("display","block");                            
                $.ajax({
                    url: "/upload_oasisenjoy_img",
                    data: formdata,
                    dataType: "json",
                    type: "post",
                    processData: false,
                    contentType: false,
                    success: function(data){ 
                        $("#loading").css("display","none"); 
                        location.reload();
                    }
                });                    
            }
        }
          
      }); 
      


      $(document).on('click','.btn_add_compatible',function()
      {                        
        var src = $(".input_uploaded_img_name").val();
        var description = $(".input_compatible_txt").val();
        if(src=="" || description == "")
        {
          return false;
        }
        else
        {
          var formdata = new FormData;
          formdata.append('img',src);
          formdata.append('name',description);
          formdata.append('_token',$('input[name=_token]').val());    
          $("#loading").css("display","block");          
          $.ajax({
              url: "/store_compatible",
              data: formdata,
              dataType: "json",
              type: "post",
              processData: false,
              contentType: false,
              success: function(data){
                $("#loading").css("display","none");
                var html = `
                  <div class="compatible_item_area">
                    <div class="compatible_item">
                        <img src="/public/upload/game/compatible/${src}" class="" alt="" style="width:24px;">
                        <span>${description}</span>
                        <button class="btn_transparent btn_delete_compatible_prev_item" data-id="${data}"><i class="fas fa-times"></i></button>
                        <input type="hidden" name="compatible_img[]" value="${src}">
                        <input type="hidden" name="compatible_txt[]" value="${description}">
                    </div>
                  </div>
                `;
                $(".added_compatible_item").append(html);
                $(".input_compatible_txt").val("");
                $(".preview_compatible_img").html("");
              }

          });            
        }
      });   

      $(document).on('click','.btn_post_img_delete',function()
      {                        
          $(this).parent().parent().remove();             
      });   
      
      $(document).on('click','.btn_delete_compatible_prev_item',function()
      {                        
          $(this).parent().parent().remove();
          var id = $(this).data('id');          
          $.ajax({
            url: "/delete_compatible",
            data: {id:id},
            dataType: "json",
            type: "get",
            
            success: function(data){
  
            }
          });      
      }); 
      
      $(document).on('click','.btn_post_img_delete_sub',function()
      {                        
          $(this).parent().parent().remove();
          postImagesub = [];
          $('.btn_post_img_delete_sub').each(function(){
              postImagesub.push($(this).data("value"));
          });            
      });  
      $(document).on('click','.btn_store_game',function()
      {      
        var is_check = true;                  
        $(".required").each(function(){
          if($(this).val()=="")
          {
            $(this).addClass("alert_boarder");
            is_check = false;
          }
        });
        postImage = [];
        $('.btn_post_img_delete').each(function(){
            postImage.push($(this).data("value"));
        }); 
        postImagesub = [];
        $('.btn_post_img_delete_sub').each(function(){
            postImagesub.push($(this).data("value"));
        });    
        if(postImage.length < 1)
        {
          is_check = false;
        }
        if(postImagesub.length < 1)
        {
          is_check = false;
        }
        var language = '';
        $(".language_area").html("");
        $(".options .opt").each(function(){
          if($(this).hasClass('selected'))
          {
            language+=$(this).find('label').html();
            var html='<input type="hidden" name="language[]" value="'+$(this).find('label').html()+'">';
            $(".language_area").append(html);
          }
        });
        if(language == "")
        {
          alert("Select Language");
          is_check = false;
          return false;
        }
        if(is_check)
        {          
          $("#loading").css("display","block");          
          $.ajax({
              url: "/store_game",
              data: $("#form_new_game").serialize(),
              dataType: "json",
              type: "post",              
              success: function(response){
                console.log(response);
                $("#loading").css("display","none");  
                location.reload();
                var cur_url = window.location.href.replace('games', 'dashboard');                       
                window.location.replace(cur_url);
              }
          });             
        }
        else
        {
          return false;
        }
      });  

      
      $(document).on('click','.btn_store_mainCategory',function()
      {      
        var is_check = true;                  
        $("#form_new_category .required").each(function(){
          if($(this).val()=="")
          {
            $(this).addClass("alert_boarder");
            is_check = false;
          }
        });
                
        if(is_check)
        {          
          $("#loading").css("display","block");          
          $.ajax({
              url: "/store_main_category",
              data: $("#form_new_category").serialize(),
              dataType: "json",
              type: "post",              
              success: function(response){                 
                 $("#loading").css("display","none");  
                 location.reload();
              }
          });             
        }
        else
        {
          return false;
        }
      });  


      $(document).on('click','.btn_store_subCategory',function()
      {      
        var is_check = true;                  
        $("#form_new_subcategory .required").each(function(){
          if($(this).val()=="")
          {
            $(this).addClass("alert_boarder");
            is_check = false;
          }
        });
                
        if(is_check)
        {          
          $("#loading").css("display","block");          
          $.ajax({
              url: "/store_sub_category",
              data: $("#form_new_subcategory").serialize(),
              dataType: "json",
              type: "post",              
              success: function(response){                 
                 $("#loading").css("display","none");  
                 location.reload();
              }
          });             
        }
        else
        {
          return false;
        }
      });  


      $(".select_game_status").change(function() {
        var id = $(this).data('id');
        var status = $(".select_game_status").val();
        $.ajax({
            url: "/change_game_status",
            data: {id:id,status:status},
            dataType: "json",
            type: "get",              
            success: function(response){ 
              location.reload();
            }
        });          
      });

      $(window).on('ariaAccordion.initialised', function (event, element) {
        
      });

      $('.accordion-group').ariaAccordion({
        contentRole: ['document', 'application', 'document'],
        slideSpeed: 400
      });
      $(document).on('click','.btn_addCart',function()
      {      
        
        var count = parseInt($('.addcart_item').length);
        var id = $(this).data('id');
        $.ajax({
          url: "/addcart",
          data: {id:id},
          dataType: "json",
          type: "get",              
          success: function(response){    
            if(response.auth == "false")             
            {
              swal({
                title: "You are not login!",  
                text: "Please login.",                          
                type: "error"
              }).then(function() {
                  location.reload();
              });
            }
            else if(response.result == "true")
            {
              var game = response.game;
              var html = `
                <div class="dropdown-item addcart_item pos_rel">
                  <span>${game.title}</span>
                  <button data-id="${response.id}" class="btn_transparent btn_delete_checkout_item btn_delete_checkout_item_${response.id}" style="top:5px!important;">
                      <i class="fas fa-times"></i>
                  </button>
                </div>
              `;
              $(".addcart_list").prepend(html);
              
              $(".go_checkoutpage").css("display","block");
              $(".empty_addCart").css("display","none");
              $(".count_addcart").html(count+1);
              $(".count_addcart").css("display","block");
              
            }            
          }
        });         

        
      });  
      $(document).on('click','.btn_delete_checkout_item',function()
      {      
        
        var id = $(this).data('id');
        $(".btn_delete_checkout_item_"+id).parent().remove();
        $(".count_addcart").html($('.addcart_item').length);
        var total = 0;
        $("input.item_price").each(function(){
          total+=parseInt($(this).val());          
        });
        $(".btn_pay_addcart").attr('data-price',total); 
        $("span.price").html(total); 

        if($('.addcart_item').length<1)
        {
          $(".go_checkoutpage").css("display","none");
          $(".empty_addCart").css("display","block");
          $(".count_addcart").css("display","none");
          if($(".where").val()=="1")
          {            
            var cur_url = window.location.href.replace('checkout', '');                       
            window.location.replace(cur_url);
          }
        }
        $.ajax({
          url: "/delete_addcart",
          data: {id:id},
          dataType: "json",
          type: "get",              
          success: function(response){    
            if(response.auth == "false")             
            {              
              location.reload();              
            }            
          }
        });         

        
      });  
      

  }());
 

    (function () {
      
      $(document).on('click','.btn_edit_category',function(){    
        var name = $(this).data('name'); 
        var id = $(this).data('id'); 
        $(".input_category_name").val(name);   
        $(".input_category_id").val(id);   
        $("#editCategory").modal('toggle');
      });

      $(document).on('click','.btn_modal_main_edit',function(){    
        var name = $(".input_category_name").val(); 
        var id = $(".input_category_id").val();        
        if(id=="" || name=="")
        {
          return false;
        }
        else
        {
          $.ajax({
            url: "/edit_main_category",
            data: {id:id,name:name},
            dataType: "json",
            type: "get",              
            success: function(response){ 
              location.reload();
            }
          });          
        }
      });

      $(document).on('click','.btn_delete_category',function(){ 
        var id = $(this).data('id');        
        if(id=="")
        {
          return false;
        }
        else
        {
          $.ajax({
            url: "/delete_main_category",
            data: {id:id},
            dataType: "json",
            type: "get",              
            success: function(response){ 
              location.reload();
            }
          });          
        }
      });

      $(document).on('click','.btn_edit_subcategory',function(){    
        var name = $(this).data('name'); 
        var id = $(this).data('id'); 
        $(".input_subcategory_name").val(name);   
        $(".input_subcategory_id").val(id);   
        $("#editSubCategory").modal('toggle');
      });

      $(document).on('click','.btn_modal_sub_edit',function(){    
        var name = $(".input_subcategory_name").val(); 
        var id = $(".input_subcategory_id").val();        
        if(id=="" || name=="")
        {
          return false;
        }
        else
        {
          $.ajax({
            url: "/edit_sub_category",
            data: {id:id,name:name},
            dataType: "json",
            type: "get",              
            success: function(response){ 
              location.reload();
            }
          });          
        }
      });

      $(document).on('click','.btn_delete_subcategory',function(){ 
        var id = $(this).data('id');        
        if(id=="")
        {
          return false;
        }
        else
        {
          $.ajax({
            url: "/delete_sub_category",
            data: {id:id},
            dataType: "json",
            type: "get",              
            success: function(response){ 
              location.reload();
            }
          });          
        }
      });
      
    }());

    (function () {      
      

    }());    
   

    // edit function
    (function () {
      $(document).on('click','.btn_delete_game',function(){
        var id = $(this).data('id');
        if(id == "")
        {
          return false;
        }
        else
        {
          if (!confirm("Do you want to delete")){
            return false;
          }
          else
          {
              $.ajax({
                  url: "/delete_game",
                  method: 'GET', 
                  type: 'json',
                  data: {id:id},     
                  success: function(result){                  
                      if(result)
                      {
                          location.reload();
                      }
                  }
              })
          }
        }
      });

      $(document).on('click','.btn_edit_game',function(){
        var id = $(this).data('id');
        if(id == "")
        {
          return false;
        }
        else
        {
          $(".form_edit_game_id").val(id);
          $(".form_edit_game").submit();
        }
      });
      
      
    }());  
   
   

});


    