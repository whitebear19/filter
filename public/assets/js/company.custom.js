
jQuery(function ($) {

    'use strict';
    var postImage = [];
    var postImagesub = [];
// ----------------------------------------------------------------
   


    (function() {
        $(document).ready(function () {
            
        });
       
    }());

    (function () {
      
        $(document).on('click','.btn_company_create_user',function(){
            var is_valid = true;
            $("form input").each(function(){
                if($(this).val()=="")
                {
                    $(this).addClass("alert");
                    is_valid = false;
                }
            });
            if(!is_valid)
            {
                return false;
            }
            if($(".password1").val()!=$(".password2").val())
            {
                is_valid = false;
                alert("Don't match password!");
            }
            if(!is_valid)
            {
                return false;
            }
            else
            {
                $("#loading").css("display","block");
                var data = $(".form_create_user").serialize();
                $.ajax({
                    url: "/create_user",          
                    dataType: "json",
                    type: "post",
                    data: data,
                    success: function(data){ 
                        $("#loading").css("display","none"); 
                        console.log(data.result);
                        if(data.result == 'email_err')
                        {
                            swal({
                                title: "The email already stored!",  
                                text: "Please try another.",                          
                                type: "error"
                              }).then(function() {
                                  $("input[name='email']").focus();
                              });
                        }
                        else if(data.result == 'auth_err')
                        {
                            location.reload();
                        }
                        else if(data.result == 'over_err')
                        {
                            // swal({
                            //     title: "You can not create user anymore!",  
                            //     text: "Please confirm your plan by clicking <a href='/subscriptions'>here</a>.",                          
                            //     type: "error"
                            //   }).then(function() {
                            //       location.reload();
                            //   });
                            $("#alertmembership").modal('show');
                        }
                        else if(data.result == 'ok')
                        {
                            swal({
                                title: "Successfuly created!",                       
                                type: "success"
                              }).then(function() {
                                  location.reload();
                              });
                        }
                    }
                  });
            }
        });
        $(document).on('click','.alert',function(){
            $(this).removeClass('alert');
        });
    }());
 

   
   

});


    