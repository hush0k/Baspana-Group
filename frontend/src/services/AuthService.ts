import api from './api';
import { AxiosResponse } from 'axios';

interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    date_of_birth: string;
    phone_number: string;
    city: string;
    avatar_url: string;
}

interface CurrentUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', {
            email,
            password
        });
        return response.data;
    },

    register: async (userData: UserData): Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> = await api.post('/auth/register', userData);
        return response.data;
    },

    getCurrentUser: async (): Promise<CurrentUser> => {
        const response: AxiosResponse<CurrentUser> = await api.get('/auth/me');
        return response.data;
    },

    logout: (): void => {
        localStorage.removeItem('access_token');
    }
};