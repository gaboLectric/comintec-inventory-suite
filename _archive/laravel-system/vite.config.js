import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

// Permite configurar la URL del backend vía variable de entorno (Docker / local)
const backendTarget = process.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        proxy: {
            '/api': {
                target: backendTarget,
                changeOrigin: true,
                secure: false,
            },
        },
        watch: {
            usePolling: true,
        },
    },
});
