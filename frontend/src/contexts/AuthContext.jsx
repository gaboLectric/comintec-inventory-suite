import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pb from '../services/pocketbase';
import { getErrorMessage } from '../utils/errorHandler';
import { useToast } from '../components/Toast';

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
    const toast = useToast();

    const enforceAuthValidity = useCallback((options = {}) => {
        const shouldNotify = Boolean(options?.notify);

        // If token expired but model is still present, force logout.
        if (pb.authStore.model && !pb.authStore.isValid) {
            pb.authStore.clear();
            setUser(null);

            if (shouldNotify && toast?.addToast) {
                toast.addToast('Tu sesión expiró. Inicia sesión nuevamente.', 'warning', {
                    placement: 'top-right',
                    important: true,
                    durationMs: 6000,
                });
            }
        }
    }, [toast]);

    useEffect(() => {
        // Sincronizar estado con el store de PocketBase
        const unsubscribe = pb.authStore.onChange((token, model) => {
            setUser(model);

            // En algunos casos el modelo queda cargado aunque el token ya no sea válido.
            // Forzamos logout en cuanto detectamos expiración.
            enforceAuthValidity({ notify: true });
        });

        // Watchdog: el SDK no dispara eventos automáticamente al expirar el token.
        // Revisamos periódicamente y también al volver al tab/ventana.
        const intervalId = setInterval(() => {
            enforceAuthValidity({ notify: true });
        }, 15000);

        const onFocus = () => enforceAuthValidity({ notify: true });
        const onVisibilityChange = () => {
            if (!document.hidden) enforceAuthValidity({ notify: true });
        };

        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            unsubscribe();
            clearInterval(intervalId);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [enforceAuthValidity]);

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
                
                // Usar el helper para obtener un mensaje amigable
                // Priorizamos el error de admin si es un fallo de autenticación
                const message = getErrorMessage(adminError);
                return { success: false, error: message };
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        pb.authStore.clear();
        setUser(null);
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
        isAuthenticated: Boolean(user && pb.authStore.isValid),
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
