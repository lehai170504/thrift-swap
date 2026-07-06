import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Try to get token from Cookies as fallback
    if (typeof window !== 'undefined') {
      const userStr = Cookies.get('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj && userObj.token) {
            config.headers.Authorization = `Bearer ${userObj.token}`;
          }
        } catch (e) {
          console.error('Failed to parse user from Cookies', e);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
