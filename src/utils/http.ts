import axios from 'axios';

import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Add user_id as a query parameter if available
        const user = await AsyncStorage.getItem('user_profile');
        const userData = JSON.parse(user)
        if (userData.user_id) {
            if (!config.params) config.params = {};
            config.params.user_id = userData.user_id;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        // console.log('[Axios Response]', response);
        return response?.data
    },
    (error) => {
        console.error('[Axios Error]', error.message);
        console.error(error.config);
        console.error(error.code);
        if (error.response) {
            console.error('[Response Error Data]', error.response.data);
        }
        return Promise.reject(error.response.data);
    }
);

export default api;
