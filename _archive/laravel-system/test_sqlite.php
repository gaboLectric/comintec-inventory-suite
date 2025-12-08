<?php
// Test script para verificar la conexión a SQLite

echo "Verificando extensiones SQLite:\n";
echo "PDO SQLite: " . (extension_loaded('pdo_sqlite') ? 'SÍ' : 'NO') . "\n";
echo "SQLite3: " . (extension_loaded('sqlite3') ? 'SÍ' : 'NO') . "\n";

echo "\nIntentando crear una conexión SQLite:\n";

try {
    $dbPath = __DIR__ . '/database/database.sqlite';
    echo "Ruta de la base de datos: " . $dbPath . "\n";
    
    if (!file_exists($dbPath)) {
        echo "ERROR: El archivo de base de datos no existe.\n";
        exit(1);
    }
    
    echo "El archivo de base de datos existe.\n";
    
    // Intentar conexión PDO
    $pdo = new PDO("sqlite:$dbPath", null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "Conexión PDO exitosa.\n";
    
    // Probar una consulta simple
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table';");
    $tables = $stmt->fetchAll();
    
    echo "Tablas en la base de datos:\n";
    foreach ($tables as $table) {
        echo "- " . $table['name'] . "\n";
    }
    
    // Probar con la tabla users
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users;");
    $result = $stmt->fetch();
    echo "Número de usuarios: " . $result['count'] . "\n";
    
    echo "\n¡Conexión SQLite funcionando correctamente!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}