import axios from '../axios';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  interests?: string[];
  role: string;
  createdAt: string;
}

export const userApi = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await axios.get('/users/me');
    return data;
  },

  updateProfile: async (payload: { fullName: string; phone: string; address: string; avatar?: string; interests?: string[] }): Promise<UserProfile> => {
    const { data } = await axios.put('/users/me', payload);
    return data;
  },

  changePassword: async (payload: any): Promise<any> => {
    const { data } = await axios.put('/users/me/password', payload);
    return data;
  },

  getUserByUsername: async (username: string): Promise<UserProfile> => {
    const { data } = await axios.get(`/users/profile/${username}`);
    return data;
  }
};
