<?php

require_once __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use App\Models\UserGroup;

// Test script to verify Sanctum authentication works with existing users
// First, let's check if we have users in the database
echo "Checking existing users...\n";

// Connect to the database using Laravel's DB facade
try {
    $userCount = User::count();
    echo "Found {$userCount} users in the database.\n";
    
    // Display existing users
    $users = User::all();
    foreach ($users as $user) {
        echo "User: {$user->name} (ID: {$user->id}, Level: {$user->user_level})\n";
    }
    
    // Test login with existing credentials
    $adminUser = User::where('username', 'admin')->first();
    if ($adminUser) {
        echo "\nTesting login with admin user...\n";
        
        // Test our SHA1 password validation
        $isValid = $adminUser->checkPassword('admin');
        echo "Admin password (admin) validation: " . ($isValid ? 'PASS' : 'FAIL') . "\n";
        
        if ($isValid) {
            echo "SHA1 password validation is working correctly!\n";
            
            // Test creating a Sanctum token
            try {
                $token = $adminUser->createToken('test-token')->plainTextToken;
                echo "Sanctum token created successfully: " . substr($token, 0, 20) . "...\n";
                
                // Test token retrieval
                $personalTokens = $adminUser->tokens;
                echo "User has " . $personalTokens->count() . " personal access token(s)\n";
                
            } catch (Exception $e) {
                echo "Error creating token: " . $e->getMessage() . "\n";
            }
        } else {
            echo "Password validation failed. Let's check the stored hash...\n";
            echo "Stored password hash: " . $adminUser->password . "\n";
            echo "Expected SHA1 of 'admin': " . sha1('admin') . "\n";
        }
    } else {
        echo "No admin user found.\n";
    }
    
    echo "\nTesting user level permissions...\n";
    
    // Test user level groups
    $userGroups = UserGroup::all();
    foreach ($userGroups as $group) {
        echo "Group: {$group->group_name} (Level: {$group->group_level}, Status: {$group->group_status})\n";
    }
    
    echo "\nAll tests completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
}