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
        console.error('Login error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        if (error.response?.data?.detail) {
            throw new Error(error.response.data.detail);
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
    console.log(response);
    return response.data;
};