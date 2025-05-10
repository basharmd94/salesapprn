import api from './api';

export const login = async (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }

    try {
        const formData = new URLSearchParams();
        formData.append('username', username.trim());
        formData.append('password', password);

        const response = await api.post('/users/login', formData);
        return response.data;
    } catch (error) {
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
        } else if (error.message === 'Network Error') {
            throw new Error('Network Error: Unable to connect to the server. Please check your internet connection and server availability.');
        }
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};

export const logout = async () => {
    const response = await api.post('/users/logout');
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
};