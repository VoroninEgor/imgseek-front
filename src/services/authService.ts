import axios from 'axios';
import type { AuthRequest, AuthResponse } from '../types/auth';

const API_URL = '';

export const authService = {
    async register(data: AuthRequest): Promise<AuthResponse> {
        console.log('Register request data:', data);
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    async login(data: AuthRequest): Promise<AuthResponse> {
        console.log('Login request data:', data);
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    }
}; 