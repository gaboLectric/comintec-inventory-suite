import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './comintec-design-system/emotion/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Categories } from './pages/Categories';
import { Users } from './pages/Users';

function AppRoutes() {
    // Fallback para asegurar que /login exista siempre
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute requiredLevel={3}>
                    <Layout />
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={
                    <ProtectedRoute requiredLevel={2}>
                        <Products />
                    </ProtectedRoute>
                } />
                <Route path="sales" element={<Sales />} />
                <Route path="categories" element={
                    <ProtectedRoute requiredLevel={2}>
                        <Categories />
                    </ProtectedRoute>
                } />
                <Route path="users" element={
                    <ProtectedRoute requiredLevel={1}>
                        <Users />
                    </ProtectedRoute>
                } />
                <Route path="reports" element={<div style={{ color: '#eeeeec' }}>Reportes - Próximamente</div>} />
            </Route>
            {/* Catch-all: si no matchea y no autenticado → login */}
            <Route path="*" element={<Login />} />
        </Routes>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
