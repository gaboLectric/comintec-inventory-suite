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
    const [isInitialized, setIsInitialized] = useState(false);
    const toast = useToast();

    const enforceAuthValidity = useCallback((options = {}) => {
        const shouldNotify = Boolean(options?.notify);

        // If token expired but model is still present, force logout.
        if (pb.authStore.model && !pb.authStore.isValid) {
            console.log('Token expired, clearing auth store');
            pb.authStore.clear();
            setUser(null);

            if (shouldNotify && toast?.addToast) {
                toast.addToast('Tu sesión expiró. Inicia sesión nuevamente.', 'warning', {
                    placement: 'top-right',
                    important: true,
                    durationMs: 6000,
                });
            }
            return false;
        }
        return true;
    }, [toast]);

    // Initialize auth state on mount
    useEffect(() => {
        console.log('Initializing auth state...');
        console.log('Auth store model:', pb.authStore.model);
        console.log('Auth store isValid:', pb.authStore.isValid);
        
        // Set initial user state
        setUser(pb.authStore.model);
        
        // Check if current auth is valid
        enforceAuthValidity({ notify: false });
        
        setIsInitialized(true);
    }, [enforceAuthValidity]);

    useEffect(() => {
        if (!isInitialized) return;

        // Sincronizar estado con el store de PocketBase
        const unsubscribe = pb.authStore.onChange((token, model) => {
            console.log('Auth store changed:', { token: !!token, model: !!model });
            setUser(model);

            // En algunos casos el modelo queda cargado aunque el token ya no sea válido.
            // Forzamos logout en cuanto detectamos expiración.
            if (model) {
                enforceAuthValidity({ notify: true });
            }
        });

        // Watchdog: el SDK no dispara eventos automáticamente al expirar el token.
        // Revisamos periódicamente y también al volver al tab/ventana.
        const intervalId = setInterval(() => {
            if (pb.authStore.model) {
                enforceAuthValidity({ notify: true });
            }
        }, 30000); // Check every 30 seconds instead of 15

        const onFocus = () => {
            if (pb.authStore.model) {
                enforceAuthValidity({ notify: true });
            }
        };
        
        const onVisibilityChange = () => {
            if (!document.hidden && pb.authStore.model) {
                enforceAuthValidity({ notify: true });
            }
        };

        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            unsubscribe();
            clearInterval(intervalId);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [enforceAuthValidity, isInitialized]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            console.log('Attempting login...');
            // Intentar login contra la colección 'users'
            await pb.collection('users').authWithPassword(username, password);
            console.log('User login successful');
            return { success: true };
        } catch (error) {
            console.log('User login failed, trying admin login...');
            // Si falla, intentar como Admin de PocketBase
            try {
                await pb.admins.authWithPassword(username, password);
                console.log('Admin login successful');
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

    const logout = useCallback(() => {
        console.log('Logging out...');
        pb.authStore.clear();
        setUser(null);
        
        // Force a page reload to ensure clean state
        // This helps prevent any cached state issues
        setTimeout(() => {
            window.location.href = '/login';
        }, 100);
    }, []);

    // Verificar si el usuario tiene el nivel requerido
    // Adaptado para PocketBase: asumimos que el registro de usuario tiene un campo 'user_level'
    // Si no existe, por defecto asumimos nivel 3 (User)
    const hasPermission = useCallback((requiredLevel) => {
        if (!user || !pb.authStore.isValid) return false;
        // Si es superusuario (Admin de PocketBase), tiene acceso total (nivel 1 virtual)
        if (pb.authStore.isSuperuser) return true;
        
        const level = user.user_level || 3; 
        return level <= requiredLevel;
    }, [user]);

    // Verificar si es admin
    const isAdmin = useCallback(() => {
        if (!user || !pb.authStore.isValid) return false;
        // Si es admin de PocketBase (pb.authStore.isSuperuser) o tiene nivel 1
        return pb.authStore.isSuperuser || (user.user_level === 1);
    }, [user]);

    // Verificar si es special o admin
    const isSpecial = useCallback(() => {
        if (!user || !pb.authStore.isValid) return false;
        const level = user.user_level || 3;
        return level <= 2;
    }, [user]);

    // Computed authentication state
    const isAuthenticated = Boolean(user && pb.authStore.isValid);

    const value = {
        user,
        login,
        logout,
        hasPermission,
        isAdmin,
        isSpecial,
        isAuthenticated,
        loading: loading || !isInitialized
    };

    return (
        <AuthContext.Provider value={value}>
            {isInitialized && children}
        </AuthContext.Provider>
    );
};
