// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error);
    }
);

// Auth API
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');

// Store API
export const getStore = () => api.get('/store');

// Categories API
export const getCategories = () => api.get('/categories');

// Products API
export const getProducts = () => api.get('/products');
export const getPopularProducts = () => api.get('/products/popular');
export const getEssentialProducts = () => api.get('/products/essential');
export const searchProducts = (query) => api.get('/products/search', { params: { q: query } });
export const getProductById = (id) => api.get(`/products/${id}`);

// Cart API
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => 
    api.post('/cart/add', { product_id: productId, quantity });
export const updateCartItem = (productId, quantity) => 
    api.put(`/cart/update/${productId}`, { quantity });
export const removeCartItem = (productId) => 
    api.delete(`/cart/remove/${productId}`);
export const clearCart = () => api.delete('/cart/clear');

// Orders API
export const placeOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

// User Profile API
export const getProfile = () => api.get('/user/profile');
export const updateProfile = (data) => api.put('/user/profile', data);

// Database API (for development)
export const initMockData = () => api.post('/mock/init');
export const checkDbConnection = () => api.get('/db/check');

export default api;