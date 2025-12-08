import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '../services/pocketbase';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(pb.authStore.model);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Sincronizar estado con el store de PocketBase
        const unsubscribe = pb.authStore.onChange((token, model) => {
            setUser(model);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (username, password) => {
        setLoading(true);
        try {
            // Intentar login contra la colección 'users'
            await pb.collection('users').authWithPassword(username, password);
            return { success: true };
        } catch (error) {
            // Si falla, intentar como Admin de PocketBase
            try {
                await pb.admins.authWithPassword(username, password);
                return { success: true };
            } catch (adminError) {
                console.error('User login error:', error);
                console.error('Admin login error:', adminError);
                
                // Preferimos mostrar el error de admin si intentamos loguear como admin,
                // ya que es el último intento. O concatenar ambos.
                // Por ahora, mostremos el error de admin si es diferente al de usuario, o un mensaje genérico.
                const message = adminError.message || error.message || 'Error al iniciar sesión';
                return { success: false, error: message };
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        pb.authStore.clear();
    };

    // Verificar si el usuario tiene el nivel requerido
    // Adaptado para PocketBase: asumimos que el registro de usuario tiene un campo 'user_level'
    // Si no existe, por defecto asumimos nivel 3 (User)
    const hasPermission = (requiredLevel) => {
        if (!user) return false;
        // Si es superusuario (Admin de PocketBase), tiene acceso total (nivel 1 virtual)
        if (pb.authStore.isSuperuser) return true;
        
        const level = user.user_level || 3; 
        return level <= requiredLevel;
    };

    // Verificar si es admin
    const isAdmin = () => {
        if (!user) return false;
        // Si es admin de PocketBase (pb.authStore.isSuperuser) o tiene nivel 1
        // Nota: isAdmin está deprecado en versiones recientes del SDK
        return pb.authStore.isSuperuser || pb.authStore.isAdmin || (user.user_level === 1);
    };

    // Verificar si es special o admin
    const isSpecial = () => {
        if (!user) return false;
        const level = user.user_level || 3;
        return level <= 2;
    };

    const value = {
        user,
        login,
        logout,
        hasPermission,
        isAdmin,
        isSpecial,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
