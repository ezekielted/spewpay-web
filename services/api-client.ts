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
    // Check if the request is an auth request to avoid breaking login/signup flows
    const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                         error.config?.url?.includes('/auth/register') ||
                         error.config?.url?.includes('/auth/verify-email');
    
    if (!isAuthRequest && (error.response?.status === 401 || error.response?.status === 403)) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        window.location.href = "/login?session_expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;