<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Handle user login
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Buscar al usuario por nombre de usuario
        $user = User::where('username', $request->username)->first();

        if (!$user) {
            throw ValidationException::withMessages([
                'username' => ['Credenciales inválidas.'],
            ]);
        }

        // Verificar la contraseña usando el método personalizado que soporta SHA1 (del sistema original)
        if (!$user->checkPassword($request->password)) {
            throw ValidationException::withMessages([
                'password' => ['Credenciales inválidas.'],
            ]);
        }

        // Actualizar última fecha de ingreso
        $user->update(['last_login' => now()]);
        
        // Autenticar usuario
        Auth::login($user);

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
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
     * Handle user logout
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Cierre de sesión exitoso']);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}