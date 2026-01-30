// services/auth.service.ts
import apiClient from './api-client';

export const authService = {
  // Corrected to match the backend: POST /api/v1/auth/register
  signup: (data: any) => apiClient.post('/auth/register', data),

  // Standard login endpoint: POST /api/v1/auth/login
  login: (credentials: any) => apiClient.post('/auth/login', credentials),

  // Forgot password: POST /api/v1/auth/forgot-password
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),

  // Reset password: POST /api/v1/auth/reset-password
  resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),

  // Verify email: POST /api/v1/auth/verify-email
  verifyEmail: (data: { email: string; token: string }) => apiClient.post('/auth/verify-email', data),

  // Resend verification email: POST /api/v1/auth/resend-verification-email
  resendVerificationEmail: (email: string) => apiClient.post('/auth/resend-verification-email', { email }),
};