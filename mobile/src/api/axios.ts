import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 10.0.2.2 is the alias for host loopback interface in Android Emulator
const ANDROID_LOCAL_HOST = 'http://10.0.2.2:8080/api/v1';
const IOS_LOCAL_HOST = 'http://localhost:8080/api/v1';

export const API_BASE_URL = Platform.OS === 'android' ? ANDROID_LOCAL_HOST : IOS_LOCAL_HOST;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // In a real app, you would dispatch an event to log the user out visually here
    }
    return Promise.reject(error);
  }
);

export default api;
