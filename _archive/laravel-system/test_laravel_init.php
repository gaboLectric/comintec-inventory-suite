<?php
// Script para probar la inicialización de Laravel con configuración de sesión

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Facade;
use Illuminate\Database\Capsule\Manager as Capsule;

// Intentar recrear el problema de la sesión
try {
    echo "Probando configuración de Laravel con conexión a base de datos...\n";
    
    // Crear la aplicación de Laravel manualmente
    $app = new Illuminate\Foundation\Application(
        $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
    );

    $app->useEnvironmentPath($_ENV['APP_BASE_PATH'] ?? dirname(__DIR__));
    $app->useStoragePath($_ENV['APP_STORAGE_PATH'] ?? $app->basePath('storage'));
    $app->bootstrapWith([
        Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
        Illuminate\Foundation\Bootstrap\LoadConfiguration::class,
        Illuminate\Foundation\Bootstrap\HandleExceptions::class,
        Illuminate\Foundation\Bootstrap\RegisterFacades::class,
        Illuminate\Foundation\Bootstrap\SetRequestForConsole::class,
        Illuminate\Foundation\Bootstrap\RegisterProviders::class,
        Illuminate\Foundation\Bootstrap\BootProviders::class,
    ]);

    // Intentar inicializar la configuración
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    echo "Laravel inicializado correctamente.\n";
    
    // Intentar acceso a base de datos
    $userCount = DB::table('users')->count();
    echo "Número de usuarios: $userCount\n";
    
    echo "¡La conexión a la base de datos funciona!\n";
    
} catch (Exception $e) {
    echo "Error al inicializar Laravel: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}

// Ahora vamos a probar con la configuración de Laravel tal como está
try {
    echo "\nProbando con configuración de entorno de Laravel...\n";
    
    // Cargar variables de entorno
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
    
    // Configurar conexión usando la configuración de Laravel
    $capsule = new Capsule;
    
    $capsule->addConnection([
        'driver' => 'sqlite',
        'database' => $_ENV['DB_DATABASE'] ?? __DIR__.'/database/database.sqlite',
        'prefix' => '',
        'foreign_key_constraints' => (bool) ($_ENV['DB_FOREIGN_KEYS'] ?? true),
    ]);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();
    
    echo "Conexión configurada con variables de entorno.\n";
    
    // Intentar operación simple
    $users = $capsule::table('users')->get();
    echo "Usuarios obtenidos: " . count($users) . "\n";
    
} catch (Exception $e) {
    echo "Error con configuración de entorno: " . $e->getMessage() . "\n";
}