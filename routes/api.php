<?php

use App\Http\Controllers\ColorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\SizeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::post('/register', [RegisterController::class, 'createUser']);
// Route::post('/login', [LoginController::class, 'loginAPI']);
// Route::post('/logout', [LoginController::class, 'logoutAPI']);


Route::get('products', [ProductController::class, 'list']);
Route::get('products/{product}', [ProductController::class, 'show']);
Route::post('products', [ProductController::class, 'store']);
Route::put('products', [ProductController::class, 'update']);
Route::delete('products/{product}', [ProductController::class, 'destroy']);

Route::get('products/{product}/images', [ProductImageController::class, 'listImagesOfProduct']);
Route::get('products/images/{productImage}', [ProductImageController::class, 'show']);
Route::post('products/{product}/images', [ProductImageController::class, 'store']);
Route::put('products/images/{productImage}', [ProductImageController::class, 'update']);
Route::delete('products/images/{productImage}', [ProductImageController::class, 'destroy']);

Route::get('products/{product}/colors', [ColorController::class, 'listColorsOfProduct']);
Route::get('products/colors/{color}', [ColorController::class, 'show']);
Route::post('products/{product}/colors', [ColorController::class, 'store']);
Route::put('products/colors/{color}', [ColorController::class, 'update']);
Route::delete('products/colors/{color}', [ColorController::class, 'destroy']);

Route::get('colors/{color}/sizes', [SizeController::class, 'listSizesOfColor']);
Route::get('colors/sizes/{size}', [SizeController::class, 'show']);
Route::post('colors/{color}/sizes', [SizeController::class, 'store']);
Route::put('colors/sizes/{size}', [SizeController::class, 'update']);
Route::delete('colors/sizes/{size}', [SizeController::class, 'destroy']);