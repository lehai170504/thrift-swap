/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/lib/axios';
import { AuthResponse } from '../types/auth';

export const authApi = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/google-login', { credential });
    return response.data;
  },

  facebookLogin: async (accessToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/facebook-login', { accessToken });
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
