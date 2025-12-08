import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, requiredLevel = 3 }) => {
    const { isAuthenticated, hasPermission, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                color: '#eeeeec' 
            }}>
                Cargando...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission(requiredLevel)) {
        return (
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                color: '#eeeeec' 
            }}>
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos suficientes para acceder a esta página.</p>
            </div>
        );
    }

    return children;
};
