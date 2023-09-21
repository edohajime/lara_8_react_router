<?php

use App\Http\Controllers\ColorController;
use App\Http\Controllers\ColorSizeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\SKUController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\WarehouseInventoryController;
use App\Http\Controllers\WarehouseIOController;
use App\Http\Controllers\WarehouseProductController;
use App\Models\ColorSize;
use App\Models\WarehouseInventory;
use App\Models\WarehouseIO;
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

Route::get('skus', [SKUController::class, 'list']);

Route::get('products', [ProductController::class, 'list']);
Route::get('products/{product}', [ProductController::class, 'show']);
Route::post('products/{product}', [ProductController::class, 'update']);
Route::delete('products/{product}', [ProductController::class, 'destroy']);

Route::get('products/{product}/images', [ProductImageController::class, 'listImagesOfProduct']);
Route::get('products/images/{productImage}', [ProductImageController::class, 'show']);
Route::post('products/{product}/images', [ProductImageController::class, 'store']);
Route::put('products/images/{productImage}', [ProductImageController::class, 'update']);
Route::delete('products/images/{productImage}', [ProductImageController::class, 'destroy']);

Route::get('products/{product}/colors', [ColorSizeController::class, 'listColorsOfProd']);
Route::get('products/{product}/sizes', [ColorSizeController::class, 'listSizesOfProd']);
Route::get('products/{product}/colorsizes', [ColorSizeController::class, 'listOfProd']);
Route::get('products/colorsizes/{sku}', [ColorSizeController::class, 'show']);
Route::post('products/{product}/colorsizes', [ColorSizeController::class, 'update']);

Route::get('warehouses', [WarehouseController::class, 'list']);
Route::get('warehouses/{warehouse}', [WarehouseController::class, 'show']);
Route::post('warehouses/{warehouse}', [WarehouseController::class, 'update']);

Route::get('warehouseinventories', [WarehouseInventoryController::class, 'list']);
Route::get('warehouseinventories/{warehouseinventorie}', [WarehouseInventoryController::class, 'show']);
Route::post('warehouseinventories/{warehouseinventorie}', [WarehouseInventoryController::class, 'update']);

Route::get('warehouseios', [WarehouseIOController::class, 'list']);
Route::get('warehouseios/{warehouseio}', [WarehouseIOController::class, 'show']);
Route::post('warehouseios/{warehouseio}', [WarehouseIOController::class, 'update']);

Route::get('warehouseproducts/{sku}', [WarehouseProductController::class, 'show']);


Route::bind('warehouseio', function ($value) {
    return WarehouseIO::where('id', $value)->firstOrFail();
});
Route::bind('warehouseinventorie', function ($value) {
    return WarehouseInventory::where('id', $value)->firstOrFail();
});
Route::bind('sku', function ($value) {
    return ColorSize::where('sku', $value)->firstOrFail();
});