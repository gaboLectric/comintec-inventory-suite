<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UserLevelCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $requiredLevel)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        
        // Comparar el nivel de usuario con el nivel requerido
        // En el sistema original: 1 = Admin (más alto), 2 = Special, 3 = User (más bajo)
        // Por lo tanto, un usuario con nivel 1 puede acceder a recursos de nivel 2 y 3
        if ($user->user_level > $requiredLevel) {
            return response()->json(['error' => 'Insufficient permissions'], 403);
        }

        return $next($request);
    }
}