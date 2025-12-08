<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Handle user login and return Sanctum token
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Buscar al usuario por nombre de usuario
        $user = User::where('username', $request->username)->first();

        if (!$user || !$user->checkPassword($request->password)) {
            throw ValidationException::withMessages([
                'credentials' => ['Credenciales inválidas.'],
            ]);
        }

        // Verificar que el usuario esté activo
        if ($user->status != 1) {
            throw ValidationException::withMessages([
                'status' => ['Usuario inactivo.'],
            ]);
        }

        // Actualizar última fecha de ingreso
        $user->update(['last_login' => now()]);

        // Crear token personal de acceso
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'user_level' => $user->user_level,
                'image' => $user->image,
                'status' => $user->status,
            ]
        ]);
    }

    /**
     * Handle user logout (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Cierre de sesión exitoso']);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Refresh token (optional feature)
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();
        
        // Revocar el token actual
        $request->user()->currentAccessToken()->delete();
        
        // Crear nuevo token
        $newToken = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Token actualizado exitosamente',
            'token' => $newToken,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'user_level' => $user->user_level,
                'image' => $user->image,
                'status' => $user->status,
            ]
        ]);
    }
}