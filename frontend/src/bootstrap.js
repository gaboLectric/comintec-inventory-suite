import axios from 'axios';
import pb from './services/pocketbase';

window.axios = axios;
window.pb = pb;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configurar base URL para axios (legacy support)
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8090';
window.API_BASE_URL = apiUrl;
window.axios.defaults.baseURL = apiUrl;

// Interceptor para manejar errores 401 (no autenticado) - Legacy
// PocketBase maneja su propio estado de autenticación
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Legacy 401 detected');
        }
        return Promise.reject(error);
    }
);
