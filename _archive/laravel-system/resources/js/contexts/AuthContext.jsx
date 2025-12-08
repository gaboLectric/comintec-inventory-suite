import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));

    // Configurar axios con token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.defaults.headers.common['Accept'] = 'application/json';
            axios.defaults.withCredentials = true;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Cargar usuario al inicio si hay token
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const response = await axios.get(window.API_BASE_URL + '/user');
                    setUser(response.data);
                } catch (error) {
                    console.error('Error cargando usuario:', error);
                    // Token inválido, limpiar
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(window.API_BASE_URL + '/login', {
                username,
                password
            });

            const { token: newToken, user: userData } = response.data;

            // Guardar token
            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            setUser(userData);

            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 
                          error.response?.data?.errors?.credentials?.[0] ||
                          'Error al iniciar sesión';
            return { success: false, error: message };
        }
    };

    const logout = async () => {
        try {
            await axios.post(window.API_BASE_URL + '/logout');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
        }
    };

    // Verificar si el usuario tiene el nivel requerido
    // Niveles: 1 = Admin (acceso total), 2 = Special, 3 = User (básico)
    // Un nivel menor puede acceder a recursos de niveles mayores
    const hasPermission = (requiredLevel) => {
        if (!user) return false;
        return user.user_level <= requiredLevel;
    };

    // Verificar si es admin
    const isAdmin = () => {
        return user?.user_level === 1;
    };

    // Verificar si es special o admin
    const isSpecial = () => {
        return user?.user_level <= 2;
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
            {children}
        </AuthContext.Provider>
    );
};
