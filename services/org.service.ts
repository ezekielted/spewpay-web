import apiClient from './api-client';

const getUserId = () => typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

export const orgService = {
    // Organization CRUD
    createOrg: (data: { name: string; type: string; metadata?: Record<string, any> }) => {
        return apiClient.post(`/orgs?userId=${getUserId()}`, data);
    },

    getMyOrgs: () => {
        return apiClient.get(`/orgs/my?userId=${getUserId()}`);
    },

    getOrgById: (orgId: string) =>
        apiClient.get(`/orgs/${orgId}`),

    updateOrg: (orgId: string, data: { name?: string; metadata?: Record<string, any> }) =>
        apiClient.patch(`/orgs/${orgId}?userId=${getUserId()}`, data),

    // Members
    getMembers: (orgId: string) =>
        apiClient.get(`/orgs/${orgId}/members`),

    updateMemberRole: (orgId: string, memberId: string, data: { role: string }) =>
        apiClient.patch(`/orgs/${orgId}/members/${memberId}?userId=${getUserId()}`, data),

    removeMember: (orgId: string, memberId: string) =>
        apiClient.delete(`/orgs/${orgId}/members/${memberId}?userId=${getUserId()}`),

    // Invitations
    createInvite: (orgId: string, data: { email: string; role?: string }) => {
        return apiClient.post(`/orgs/${orgId}/invites?userId=${getUserId()}`, {
            email: data.email,
            role: data.role || 'MEMBER',
        });
    },

    getOrgInvites: (orgId: string) =>
        apiClient.get(`/orgs/${orgId}/invites?userId=${getUserId()}`),

    getMyInvites: () => {
        return apiClient.get(`/orgs/invites/my?userId=${getUserId()}`);
    },

    acceptInvite: (inviteId: string) => {
        return apiClient.post(`/orgs/invites/${inviteId}/accept`, {
            userId: getUserId(),
        });
    },

    declineInvite: (inviteId: string) =>
        apiClient.post(`/orgs/invites/${inviteId}/decline?userId=${getUserId()}`),
};
