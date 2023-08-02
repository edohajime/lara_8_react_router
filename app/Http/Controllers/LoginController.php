<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;


class LoginController extends Controller
{
    use AuthenticatesUsers;

    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Display a view login.
     */
    public function showLoginForm(Request $request)
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if ($user === null) {
            return redirect('/login')->with('error', 'Email không tồn tại');
        }
        if (!Hash::check($request->password, $user->password)) {
            return redirect('/login')->with('error', 'Mật khẩu không đúng');
        }

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

    public function loginAPI(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if ($user === null) {
            return response()->json([
                'error' => 'Email không tồn tại'
            ]);
        }
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Mật khẩu không đúng'
            ]);
        }

        Auth::login($user);

        return response()->json([
            'login_success' => 'Đăng nhập thành công!',
        ], 200);
    }

    public function logoutAPI()
    {
        Auth::logout();
        return response()->json([
            'logout_success' => 'Đăng xuất thành công!',
        ], 200);
    }

    public function logout()
    {
        Auth::logout();
        return redirect(RouteServiceProvider::LOGIN);
    }
}