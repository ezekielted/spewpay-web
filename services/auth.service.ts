// services/auth.service.ts
import apiClient from './api-client';

export const authService = {
  // Corrected to match the backend: POST /api/v1/auth/register
  signup: (data: any) => apiClient.post('/auth/register', data),

  // Standard login endpoint: POST /api/v1/auth/login
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
};