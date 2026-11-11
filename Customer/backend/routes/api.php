<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index'])->middleware('throttle:120,1,catalog:');
Route::get('/product-images/{filename}', [ProductController::class, 'image'])->where('filename', '[A-Za-z0-9._-]+');
Route::get('/store', [SettingsController::class, 'publicShow'])->middleware('throttle:120,1,store:');
Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:20,1,checkout:');
Route::get('/orders/{number}', [OrderController::class, 'show'])->middleware('throttle:60,1,receipt:');
Route::post('/staff/login', [AuthController::class, 'login'])->middleware('throttle:staff-login');
Route::post('/admin/login', [AuthController::class, 'adminLogin'])->middleware('throttle:staff-login');
Route::post('/admin/reset-password', [AuthController::class, 'resetAdminPassword'])->middleware('throttle:5,1,password-reset:');

Route::prefix('staff')->middleware(['auth:sanctum', 'staff', 'throttle:120,1,staff-api:'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/recommendation-model', [\App\Http\Controllers\RecommendationModelController::class, 'show']);
    Route::post('/recommendation-model/train', [\App\Http\Controllers\RecommendationModelController::class, 'train'])->middleware('throttle:recommendation-training');
    Route::patch('/account', [AuthController::class, 'updateAccount']);
    Route::get('/settings', [SettingsController::class, 'show']);
    Route::patch('/settings', [SettingsController::class, 'update']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/image', [ProductController::class, 'uploadImage']);
    Route::get('/products', [ProductController::class, 'staffIndex']);
    Route::patch('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::patch('/products/{product}/recommendations', [ProductController::class, 'recommendations']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::patch('/orders/{number}/paid', [OrderController::class, 'paid']);
    Route::patch('/orders/{number}/complete', [OrderController::class, 'complete']);
    Route::patch('/orders/{number}/status', [OrderController::class, 'status']);
});
