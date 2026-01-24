// src/services/transfer.service.ts
import apiClient from './api-client';

export const transferService = {
  getBanks: () =>
    apiClient.get('/transfers/banks'),

  resolveAccount: (accountNumber: string, bankCode: string) =>
    apiClient.post('/transfers/resolve-account', { accountNumber, bankCode }),

  addRecipient: (data: { userId: string; accountNumber: string; bankCode: string; isDefault?: boolean }) =>
    apiClient.post('/transfers/recipients', data),

  getRecipients: (userId: string) =>
    apiClient.get(`/transfers/recipients`, { params: { userId } }),

  withdraw: (data: { userId: string; recipientId: string; amountInNaira: number; reason?: string; idempotencyKey?: string }) =>
    apiClient.post('/transfers/withdraw', data),

  // UPDATE THIS METHOD SPECIFICALLY
  internalTransfer: (data: { 
    sourceUserId: string; 
    destinationUserId: string; 
    amountInNaira: number; 
    description?: string 
  }) =>
    apiClient.post('/transfers/internal', data),

  deleteRecipient: (recipientId: string) =>
    apiClient.delete(`/transfers/recipients/${recipientId}`),
};