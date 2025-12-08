import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar base URL para axios
const apiUrl = window.API_BASE_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api');
window.API_BASE_URL = apiUrl; // Ensure it's set globally if not already
window.axios.defaults.baseURL = apiUrl;

// Interceptor para manejar errores 401 (no autenticado)
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Si recibimos 401, el token es inválido
            localStorage.removeItem('auth_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
