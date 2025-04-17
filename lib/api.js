import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// Comment out previous API configuration
// const API_URL = 'http://69.162.102.58:8500/api/v1';
// const baseURL = API_URL;

// Define your server IP or hostname
const SERVER_IP = '69.162.102.58';

// Always use HTTP since HTTPS is not available
const API_PROTOCOL = 'http';

// Set baseURL based on platform
const baseURL = `${API_PROTOCOL}://${SERVER_IP}:8500/api/v1`;

console.log(`App running with API endpoint: ${baseURL} (${__DEV__ ? 'Development' : 'Production'} mode)`);

const api = axios.create({
    baseURL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Cache for user data to prevent redundant API calls
let userDataCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // For login endpoint, ensure proper content type
        if (config.url === '/users/login') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        // For all other POST requests, ensure proper data formatting
        else if (config.method === 'post') {
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
            if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof config.data === 'object') {
                const formData = new URLSearchParams();
                Object.entries(config.data).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                config.data = formData.toString();
            }
        }

        // Only log in development mode and avoid verbose logging of sensitive data
        if (__DEV__ && config.url !== '/users/me') {
            console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }

        // Use cached user data for /users/me endpoint if available and not expired
        if (config.url === '/users/me' && userDataCache && (Date.now() - lastFetchTime < CACHE_DURATION)) {
            // Return a custom response to prevent actual API call
            config.adapter = () => {
                return Promise.resolve({
                    data: userDataCache,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config,
                    request: {},
                });
            };
        }

        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Cache user data from /users/me endpoint
        if (response.config.url === '/users/me' && response.data) {
            userDataCache = response.data;
            lastFetchTime = Date.now();
        }
        
        // Only log minimal response info in development mode
        if (__DEV__ && response.config.url !== '/users/me') {
            console.log(`API Response: ${response.status} - ${response.config.url}`);
        }
        return response;
    },
    async (error) => {
        if (__DEV__) {
            console.error(`API Error (${error.response?.status}): ${error.config?.url} - ${error.message}`);
        }

        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Use query parameter for refresh token as expected by the backend
                const response = await axios.post(
                    `${baseURL}/users/refresh-token?refresh_token=${encodeURIComponent(refreshToken)}`,
                    null,
                    { 
                        headers: { 
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json'
                        }
                    }
                );
                
                const { access_token } = response.data;
                await AsyncStorage.setItem('accessToken', access_token);
                
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token Refresh Error:', refreshError.message);
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                userDataCache = null; // Clear cache on auth error
                
                router.replace('/sign-in');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Function to clear the cache (use when logging out)
api.clearCache = () => {
    userDataCache = null;
    lastFetchTime = 0;
};

export default api;
