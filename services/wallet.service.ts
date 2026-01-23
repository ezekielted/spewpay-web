// services/wallet.service.ts
import apiClient from "./api-client";

export const walletService = {
  getWalletByUserId: (userId: string) =>
    apiClient.get(`/wallets/user/${userId}`),

  // Placeholder: Update the URL '/wallets' once the backend dev provides it
  createWallet: (userId: string) => 
    apiClient.post("/wallets", { userId }),

  getBalance: (walletId: string) =>
    apiClient.get(`/wallets/${walletId}/balance`),

  getTransactions: (walletId: string, page = 1, limit = 10) =>
    apiClient.get(`/wallets/${walletId}/transactions`, {
      params: { page, limit },
    }),

  getLedger: (walletId: string) => apiClient.get(`/wallets/${walletId}/ledger`),
};
