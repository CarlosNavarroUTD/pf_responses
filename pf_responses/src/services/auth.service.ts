// src/services/auth.service.ts
import api from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  email: string;
  password?: string;
  phone?: string;
  // Add other user fields as needed
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/token/', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/users/', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/users/me/');
    return response.data;
  },

  async updateUser(userData: Partial<User>) {
    const response = await api.put('/users/me/', userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me/');
    return response.data;
  }
};
