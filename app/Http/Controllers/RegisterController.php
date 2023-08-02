<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class RegisterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return view('register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) : RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 3
        ]);

        event(new Registered($user));

        return redirect('/login');
    }

    public function createUser(Request $request) {
        $ruler = [
            'name' => 'required',
            'email' => 'required|email|max:255|unique:'.User::class,
            'password' => 'required'
        ];

        $message = [
            'name.required' => 'Trường name là bắt buộc',
            'email.required' => 'Trường email là bắt buộc',
            'email.email' => 'Bạn nhập sai định dạng email',
            'email.unique' => 'Email này đã được đăng ký',
            'password.required' => 'Mật khẩu là bắt buộc',
        ];

        $validate = validator($request->all(), $ruler, $message);

        if ($validate->fails()) {
            $data = [
                'status' => false,
                'message' => $validate->errors()->first()
            ];
            return response()->json($data, 200);
        } 
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => 3
        ]);

        $data = [
            'status' => true,
            'user' => $user,
        ];

        return response()->json($data, 200);
    }
}
