@extends('layouts.main')
@section('content')

<div class="row">
    <div class="col-md-12 mt-5 table_filtera">
        <button class="btn btn_uploaddata_process">Import Data from CSV</button>        
    </div>   
</div>

    
   <script>
       $(document).ready(function () {
            $(document).on('click','.btn_uploaddata_process',function()
            {  
                $("#loading").css('display','block');
                $.ajax({
                    url: "/uploaddata_process",
                    method: 'get', 
                    success: function(result){    
                        $("#loading").css('display','none');
                                                
                    },
                    error: function(jqXHR, exception) {
                        $("#loading").css('display','none');
                    }
                });
                
            });
       });
      
   </script>
@endsection
