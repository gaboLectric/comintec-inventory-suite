import axios from 'axios';

// Use the global axios instance which is configured with interceptors and tokens in bootstrap.js
const api = axios;

export const fetchDashboardStats = async () => {
    const response = await api.get('/dashboard');
    return response.data;
};

export const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};

export const deleteUser = async (userId) => {
    await api.delete(`/users/${userId}`);
};

// Nuevas funciones para obtener datos específicos del dashboard
export const fetchTopProducts = async () => {
    const response = await api.get('/dashboard/top-products');
    return response.data;
};

export const fetchRecentProducts = async () => {
    const response = await api.get('/dashboard/recent-products');
    return response.data;
};

export const fetchRecentSales = async () => {
    const response = await api.get('/dashboard/recent-sales');
    return response.data;
};

// Funciones para gráficos
export const fetchSalesChart = async () => {
    const response = await api.get('/dashboard/sales-chart');
    return response.data;
};

export const fetchProductsByCategory = async () => {
    const response = await api.get('/dashboard/products-by-category');
    return response.data;
};

export const fetchDailySales = async () => {
    const response = await api.get('/dashboard/daily-sales');
    return response.data;
};

// Products API
export const fetchProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const updateProduct = async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
};

export const deleteProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
};

// Categories API
export const fetchCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
};

export const updateCategory = async (categoryId, categoryData) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
};

export const deleteCategory = async (categoryId) => {
    await api.delete(`/categories/${categoryId}`);
};

// Sales API
export const fetchSales = async () => {
    const response = await api.get('/sales');
    return response.data;
};

export const createSale = async (saleData) => {
    const response = await api.post('/sales', saleData);
    return response.data;
};

export const updateSale = async (saleId, saleData) => {
    const response = await api.put(`/sales/${saleId}`, saleData);
    return response.data;
};

export const deleteSale = async (saleId) => {
    await api.delete(`/sales/${saleId}`);
};
