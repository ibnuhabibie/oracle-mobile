import axios from 'axios';

import { API_BASE_URL } from '@env';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

// Optional: Add token to each request if available
api.interceptors.request.use(
    async (config) => {
        // Example: get token from async storage
        // const token = await AsyncStorage.getItem('token');
        const token = null; // Replace this with real logic
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optional: Response error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response.data);
        return Promise.reject(error.response.data);
    }
);

export default api;
