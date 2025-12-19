import './bootstrap';
import './app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './comintec-design-system/emotion/ThemeProvider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Equipments } from './pages/Equipments';
import { EquipmentInputs } from './pages/EquipmentInputs';
import { Supplies } from './pages/Supplies';
import { EquipmentOutputs } from './pages/EquipmentOutputs';
import { SupplyOutputs } from './pages/SupplyOutputs';
import { Users } from './pages/Users';
import { BulkImport } from './pages/BulkImport';

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
                <Route path="almacen/entradas" element={
                    <ProtectedRoute requiredLevel={2}>
                        <EquipmentInputs />
                    </ProtectedRoute>
                } />
                <Route path="almacen/equipos" element={<Equipments />} />
                <Route path="almacen/insumos" element={
                    <ProtectedRoute requiredLevel={2}>
                        <Supplies />
                    </ProtectedRoute>
                } />
                <Route path="salidas/equipos" element={
                    <ProtectedRoute requiredLevel={2}>
                        <EquipmentOutputs />
                    </ProtectedRoute>
                } />
                <Route path="salidas/insumos" element={
                    <ProtectedRoute requiredLevel={2}>
                        <SupplyOutputs />
                    </ProtectedRoute>
                } />
                <Route path="users" element={
                    <ProtectedRoute requiredLevel={1}>
                        <Users />
                    </ProtectedRoute>
                } />
                <Route path="import" element={
                    <ProtectedRoute requiredLevel={1}>
                        <BulkImport />
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
            <ToastProvider>
                <AuthProvider>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <AppRoutes />
                    </BrowserRouter>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
