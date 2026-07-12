/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  type: string;
  id: string;
  username: string;
  email: string;
  role: string;
  fullName?: string;
  avatar?: string;
  interests?: string[];
  phone?: string;
  address?: string;
  tier?: string;
  totalPoints?: number;
}

export const authApi = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/google-login', { credential });
    return response.data;
  },

  register: async (data: any): Promise<any> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<any> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: any): Promise<any> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },
};
