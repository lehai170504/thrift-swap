import api from '@/lib/axios';
import { UserProfile } from '../types/user';

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await api.get('/users/me');
    return data;
  },

  updateProfile: async (payload: {
    fullName: string;
    phone: string;
    address: string;
    avatar?: string;
    interests?: string[];
  }): Promise<UserProfile> => {
    const { data } = await api.put('/users/me', payload);
    return data;
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.put('/users/me/password', payload);
  },

  getUserByUsername: async (username: string): Promise<UserProfile> => {
    const { data } = await api.get(`/users/profile/${username}`);
    return data;
  },
};
