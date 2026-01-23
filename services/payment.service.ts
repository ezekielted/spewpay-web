// src/services/payment.service.ts
import apiClient from './api-client';

export interface InitializeDepositDTO {
  userId: string;
  email: string;
  amountInNaira: number;
  callbackUrl: string;
  idempotencyKey?: string;
}

export const paymentService = {
  initializeDeposit: (data: InitializeDepositDTO) => 
    apiClient.post('/payments/deposits/initialize', data),
    
  verifyDeposit: (reference: string) => 
    apiClient.get(`/payments/deposits/${reference}/verify`),
};