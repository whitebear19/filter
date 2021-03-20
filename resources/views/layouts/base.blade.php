<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('public/assets/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/css/custom.css') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/css/accordian.css') }}">    
    <link rel="stylesheet" href="{{ asset('public/assets/vendor/slick/slick.min.css') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/vendor/slick/slick-theme.min.css') }}">
    <link rel="stylesheet" href="{{ asset('public/assets/css/slick.css') }}">   
    <script src="{{ asset('public/assets/js/jquery.min.js') }}"></script>
    <script src="{{ asset('public/assets/js/bootstrap.min.js') }}"></script>   
    <script src="{{ asset('public/assets/js/accordian.js') }}"></script>       
    <script src="{{ asset('public/assets/js/slick.js') }}"></script>   
    <script src="{{ asset('public/assets/js/sweetalert2.js') }}"></script>
    <script src="{{ asset('public/assets/js/custom.js') }}"></script>   
    <script src="{{ asset('public/assets/js/autosize.js') }}"></script>   
    <script src="{{ asset('public/assets/js/main.js') }}"></script>   
    <script src="https://kit.fontawesome.com/38c20fcb98.js" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <title>{{ config('app.name', 'Game') }}</title>
</head>
<body style="    background: #181920;">     
    <main class="">
        @yield('content')
    </main>   
</body>
</html>

