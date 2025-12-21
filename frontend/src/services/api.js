import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 секунд
});

// Request interceptor - добавляет токен к запросам
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Если отправляется FormData, удаляем Content-Type чтобы браузер сам установил multipart/form-data
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        console.log('Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - обрабатывает ответы и ошибки
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('Response error:', error.response?.status, error.config?.url);

        // Если токен истек или недействителен
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;