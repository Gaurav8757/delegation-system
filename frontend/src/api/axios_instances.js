import axios from 'axios';

// Create a main axios instance for all backend requests.
const ApiRequestInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT to every outgoing request.
ApiRequestInstance.interceptors.request.use(
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

// Response Interceptor: Handle global errors 401 Unauthorized.
ApiRequestInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Automatically logout if token expires or is invalid (401)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default ApiRequestInstance;