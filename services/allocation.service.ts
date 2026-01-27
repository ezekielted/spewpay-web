import apiClient from './api-client';

export const allocationService = {
    // Allocation CRUD
    createAllocation: (orgId: string, data: {
        name: string;
        description?: string;
        assignedUserId?: string;
        parentAllocationId?: string;
    }) =>
        apiClient.post(`/orgs/${orgId}/allocations`, data),

    getOrgAllocations: (orgId: string) =>
        apiClient.get(`/orgs/${orgId}/allocations`),

    getAllocationById: (allocationId: string) =>
        apiClient.get(`/allocations/${allocationId}`),

    updateAllocation: (allocationId: string, data: { name?: string; description?: string }) =>
        apiClient.patch(`/allocations/${allocationId}`, data),

    // Funding
    fundAllocation: (allocationId: string, data: { amountInNaira: number }) =>
        apiClient.post(`/allocations/${allocationId}/fund`, data),

    fundFromParent: (allocationId: string, data: { amountInNaira: number }) =>
        apiClient.post(`/allocations/${allocationId}/fund-from-parent`, data),

    // Freeze/Unfreeze
    freezeAllocation: (allocationId: string) =>
        apiClient.post(`/allocations/${allocationId}/freeze`),

    unfreezeAllocation: (allocationId: string) =>
        apiClient.post(`/allocations/${allocationId}/unfreeze`),

    // Spending Rules
    getRules: (allocationId: string) =>
        apiClient.get(`/allocations/${allocationId}/rules`),

    addRule: (allocationId: string, data: {
        type: string;
        value: any;
        description?: string;
    }) =>
        apiClient.post(`/allocations/${allocationId}/rules`, data),

    updateRule: (ruleId: string, data: { type?: string; value?: any; description?: string }) =>
        apiClient.patch(`/rules/${ruleId}`, data),

    deleteRule: (ruleId: string) =>
        apiClient.delete(`/rules/${ruleId}`),
};
