@extends('layouts.auth')

@section('content')
    <div class="auth_body">
        <div class="">
            <label for="" class="auth_body_title">
                {{ __('Register') }}
            </label>
        </div>
        <div class="line text-right pos_rel">   
            <hr>         
            <a href="{{ route('login') }}" class="auth_which">
                Login
            </a>
        </div>
        
        
        <br>
        <form method="POST" action="{{ route('register') }}">
        @csrf
            <div>                
                <div class="text-field">
                    <label class="label">                   
                        {{ __('Name') }}
                    </label>
                    <div class="input-base">                        
                        <input id="name" type="text" class="input form-control @error('name') is-invalid @enderror" name="name" value="{{ old('name') }}" required autocomplete="name" style="padding-left:10px" autofocus>
                        @error('name')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>
                <div class="text-field">
                    <label class="label">                   
                        {{ __('Phone Number') }}
                    </label>
                    <div class="input-base">                        
                        <input type="text" class="input form-control" name="phone" value="" required style="padding-left:10px">
                    </div>
                </div>
                <div class="text-field">
                    <label class="label">                   
                        Company's Name
                    </label>
                    <div class="input-base">                        
                        <input type="text" class="input form-control" name="company" value="" required style="padding-left:10px">
                    </div>
                </div>
                <div class="text-field">
                    <label class="label">                   
                        {{ __('E-Mail Address') }}
                    </label>
                    <div class="input-base">                        
                        <input id="email" type="email" class="input form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" style="padding-left:10px">

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                    </div>
                </div>
                <div class="text-field">
                    <label class="label">                   
                        {{ __('Password') }}
                    </label>
                    <div class="input-base">
                        <input id="password" type="password" class="input form-control @error('password') is-invalid @enderror" name="password" required autocomplete="new-password"style="padding-left:10px">

                        @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>
                <div class="text-field">
                    <label class="label">                   
                        {{ __('Confirm Password') }}
                    </label>
                    <div class="input-base">
                        <input id="password-confirm" type="password" class="input form-control" name="password_confirmation" required autocomplete="new-password" style="padding-left:10px">

                        @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div>
                </div>
                <div class="text-center mt-20">
                    <button class="btn_auth" type="submit">{{ __('Register') }}</button>
                </div>
            </div>
        </form>
       
        <br>
        
    </div>
@endsection
