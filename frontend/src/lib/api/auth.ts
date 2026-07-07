/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../axios';

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
}

export const loginApi = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const googleLoginApi = async (credential: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/google-login', { credential });
  return response.data;
};

export const registerApi = async (data: any): Promise<any> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

export const forgotPasswordApi = async (email: string): Promise<any> => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordApi = async (data: any): Promise<any> => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};
