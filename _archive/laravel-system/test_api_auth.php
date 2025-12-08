<?php

// Test the full authentication workflow with cURL
// This simulates what a frontend application would do

$baseUrl = 'http://localhost:8000/api';

// Test 1: Login and get token
echo "=== Test 1: Login ===\n";
$loginData = [
    'username' => 'admin',
    'password' => 'admin'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $baseUrl . '/login');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($loginData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Login response (HTTP $httpCode):\n";
echo $response . "\n";

if ($httpCode === 200) {
    $responseData = json_decode($response, true);
    $token = $responseData['token'];
    echo "Token obtained: " . substr($token, 0, 20) . "...\n";
    
    // Test 2: Use token to access protected route
    echo "\n=== Test 2: Access protected route ===\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/user');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "User info response (HTTP $httpCode):\n";
    echo $response . "\n";
    
    // Test 3: Test user level permissions
    echo "\n=== Test 3: Test user level permissions ===\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/profile');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Profile response (HTTP $httpCode):\n";
    echo $response . "\n";
    
    // Test 4: Try to logout
    echo "\n=== Test 4: Logout ===\n";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $baseUrl . '/logout');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token,
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Logout response (HTTP $httpCode):\n";
    echo $response . "\n";
    
} else {
    echo "Login failed, cannot proceed with other tests.\n";
}

echo "\nAll tests completed!\n";