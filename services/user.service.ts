// services/user.service.ts
import apiClient from './api-client';

export const userService = {
    getUsers: () =>
        apiClient.get('/users'),

    getUserById: (userId: string) =>
        apiClient.get(`/users/${userId}`),
};
