// src/services/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.spewpay.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Auth Token from localStorage/cookies
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Skip redirect if already on login page or if it's the login request
        const isLoginPage = window.location.pathname === "/login";
        const isLoginRequest = error.config?.url?.includes("/auth/login");

        if (!isLoginPage && !isLoginRequest) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userEmail");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;