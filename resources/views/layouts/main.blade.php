<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard</title>

    <link rel="stylesheet" href="{{asset('public/css/app.css')}}">
    <link rel="stylesheet" href="{{asset('public/assets/css/main.css')}}">
    <link rel="stylesheet" href="{{ asset('public/assets/css/sumoselect.css') }}">
    <script src="{{asset('public/js/app.js')}}"></script>
    <link rel="stylesheet" type="text/css" href="{{ asset('public/assets/css/jquery.loadingModal.min.css') }}">
    <script src="{{asset('public/assets/js/jquery.loadingModal.min.js')}}"></script>
     <script src="{{ asset('public/assets/js/main.js') }}"></script>   
     <script src="{{ asset('public/assets/js/jquery.sumoselect.js') }}"></script>
    
</head>

<body>

    <div class="container-fluid " style="max-width:90%;">
        <div class="logo-box mt-3">
            <a href="#">
                <img class="img-fluid" src="{{asset('public/assets/image/logo.png')}}"><br>
            </a>
        </div>
        @yield('content')
    </div>
    <div id="loading">
		<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
	</div>
</body>

</html>