import axios from 'axios';
import { Configuration } from '@/api/generated/configuration';
import { AuthenticationApi } from '@/api/generated/api/authentication-api';
import { UsersApi } from '@/api/generated/api/users-api';
import { AppApi } from '@/api/generated/api/app-api';

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Configuration for the generated API clients
const configuration = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Create API instances with our configured axios instance
export const authApi = new AuthenticationApi(configuration, '', axiosInstance);
export const usersApi = new UsersApi(configuration, '', axiosInstance);
export const appApi = new AppApi(configuration, '', axiosInstance);

// Export the axios instance if needed for custom requests
export default axiosInstance;