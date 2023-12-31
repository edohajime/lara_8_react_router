<?php

// use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AddProductController;
use App\Http\Controllers\ColorSizeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseInventoryController;
use App\Http\Controllers\WarehouseIOController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/data', function () {
    $token = csrf_token();
    $user = Auth::user();
    return response()->json([
        'token' => $token,
        'user' => $user
    ], 200);
})->middleware('auth');

// Xóa thư mục ảnh images & reviews
Route::get('/delete', function() {
    // Storage::deleteDirectory("public/images");
    // Storage::deleteDirectory("public/reviews");
    Storage::deleteDirectory("public/products");
});
Route::get("/messages", function() {
    return view('messages');
});

Route::post('/add-product', [ProductController::class, 'store']);
Route::post('/add-review', [ReviewController::class, 'store']);
Route::post('/add-warehouse-io', [WarehouseIOController::class, 'store']);
Route::post('/add-warehouse', [WarehouseController::class, 'store']);
Route::post('/add-warehouse-inventory', [WarehouseInventoryController::class, 'store']);

Route::get('/list-review', [ReviewController::class, 'listReviews']);
Route::get('/statistic-review', [ReviewController::class, 'statistic']);

// Route::get('/list-color-sizes-of-product', [ColorSizeController::class, 'listColorSizesOfProduct']);

Route::post('/login', [LoginController::class, 'login']);
Route::get('/logout', [LoginController::class, 'logout'])->name('logout');


Route::view('/{path?}', 'reactapp')
    ->where('path', '.*');



Route::resource('register', RegisterController::class)
    ->only(['index', 'store'])
    ->names(['index' => 'register'])
    ->middleware('guest');
