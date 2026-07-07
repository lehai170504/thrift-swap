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
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và không phải là request gọi tới /refresh-token
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const userStr = Cookies.get('user');
        let refreshToken = '';
        if (userStr) {
          const userObj = JSON.parse(userStr);
          refreshToken = userObj.refreshToken || '';
        }

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const res = await api.post('/auth/refresh-token', { refreshToken });

        // Lưu lại token mới
        if (res.data && res.data.token) {
          if (userStr) {
            const userObj = JSON.parse(userStr);
            userObj.token = res.data.token;
            Cookies.set('user', JSON.stringify(userObj), { expires: 7 });
          }

          api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
          originalRequest.headers['Authorization'] = 'Bearer ' + res.data.token;

          processQueue(null, res.data.token);
          return api(originalRequest);
        }
      } catch (err) {
        processQueue(err, null);
        Cookies.remove('user');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
