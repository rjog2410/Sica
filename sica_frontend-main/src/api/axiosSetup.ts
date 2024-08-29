// api/axiosSetup.ts
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../store/authStore';

export const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // Asegúrate de que esta URL sea correcta
  timeout: 5000, // Timeout para las peticiones
});

// api/axiosSetup.ts
export const setupAxiosInterceptors = (
  notify: NotificationContextProps['notify']
) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response received:', response);
      return response;
    },
    (error: AxiosError<ApiResponse>) => {
      console.error('Response error:', error);
      if (error.response) {
        if (error.response.status === 403) {
          const logout = useAuthStore.getState().logout;
          logout();
          notify('Access denied. Please log in again.', 'info');
          window.location.href = '/unauthorized';
        } else {
          notify('An error occurred', 'error');
        }
        return Promise.reject(error);
      }
      notify('Connection error. Please try again.', 'error');
      return Promise.reject(error);
    }
  );
};
