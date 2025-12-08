<?php
// Test script más específico para verificar PDO en Laravel

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Facade;
use Illuminate\Database\Capsule\Manager as Capsule;

// Configurar una conexión directa con SQLite para probar
try {
    $pdo = new PDO('sqlite:' . __DIR__ . '/database/database.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "PDO creado exitosamente.\n";
    echo "Driver: " . $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) . "\n";
    
    // Probar una consulta simple
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table';");
    $tables = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Número de tablas: " . count($tables) . "\n";
    echo "Tablas:\n";
    foreach ($tables as $table) {
        echo "  - " . $table['name'] . "\n";
    }
    
    // Intentar con la tabla users
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users;");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Número de usuarios: " . $result['count'] . "\n";
    
    echo "\n¡PDO está funcionando correctamente!\n";
    
} catch (Exception $e) {
    echo "Error con PDO directo: " . $e->getMessage() . "\n";
}

// Probar con Illuminate Database
try {
    echo "\nProbando con Illuminate Database Component...\n";
    
    $capsule = new Capsule;
    $capsule->addConnection([
        'driver' => 'sqlite',
        'url' => env('DB_URL'),
        'database' => __DIR__.'/database/database.sqlite',
        'prefix' => '',
        'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
    ]);
    
    $capsule->setAsGlobal();
    $capsule->bootEloquent();
    
    $results = $capsule::select('SELECT name FROM sqlite_master WHERE type="table"');
    echo "Número de tablas (Illuminate): " . count($results) . "\n";
    
    echo "¡Illuminate Database está funcionando!\n";
    
} catch (Exception $e) {
    echo "Error con Illuminate Database: " . $e->getMessage() . "\n";
}