<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SaleController;

// Healthcheck público para verificar conectividad de frontend y host
Route::get('/health', function () {
    return ['status' => 'ok', 'timestamp' => now()->toISOString()];
});

// Auth endpoints
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');
Route::post('/refresh-token', [AuthController::class, 'refreshToken'])->middleware('auth:sanctum');

// Rutas protegidas por autenticación base (nivel 3 - todos los usuarios)
Route::middleware(['auth:sanctum'])->group(function () {
    // Dashboard - accesible para todos los usuarios autenticados
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/top-products', [DashboardController::class, 'topProducts']);
    Route::get('/dashboard/recent-products', [DashboardController::class, 'recentProducts']);
    Route::get('/dashboard/recent-sales', [DashboardController::class, 'recentSales']);
    Route::get('/dashboard/sales-chart', [DashboardController::class, 'salesChart']);
    Route::get('/dashboard/products-by-category', [DashboardController::class, 'productsByCategory']);
    Route::get('/dashboard/daily-sales', [DashboardController::class, 'dailySales']);
    
    // Ventas - accesible para todos los usuarios autenticados (o ajustar según reglas de negocio)
    Route::apiResource('sales', SaleController::class);
});

// Rutas para nivel 2 (Special) y nivel 1 (Admin)
Route::middleware(['auth:sanctum', 'user.level:2'])->group(function () {
    // Productos - solo Special y Admin
    Route::apiResource('products', ProductController::class);
    
    // Categorías - solo Special y Admin
    Route::apiResource('categories', CategoryController::class);
});

// Rutas solo para nivel 1 (Admin)
Route::middleware(['auth:sanctum', 'user.level:1'])->group(function () {
    // Usuarios - solo Admin
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    
    // Grupos de usuarios - solo Admin
    // Route::apiResource('groups', GroupController::class);
});
