<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FrontendController;

// Rutas públicas del frontend React
Route::get('/', [FrontendController::class, 'index']);
// Ruta de login debe servir la misma vista inicial para que el router de React maneje la pantalla
Route::get('/login', [FrontendController::class, 'index']);
Route::get('/dashboard', [FrontendController::class, 'index']);
Route::get('/products', [FrontendController::class, 'index']);
Route::get('/categories', [FrontendController::class, 'index']);
Route::get('/sales', [FrontendController::class, 'index']);
Route::get('/users', [FrontendController::class, 'index']);

// Ruta para assets compilados de React
Route::get('/build/{path}', [FrontendController::class, 'assets'])->where('path', '.*');

// Cualquier otra ruta SPA que no sea API o almacenamiento debe devolver la vista
Route::get('/{any}', [FrontendController::class, 'index'])->where('any', '^(?!api|storage|_debugbar|sanctum|horizon).*');