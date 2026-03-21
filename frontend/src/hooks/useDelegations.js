import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiServices, API_ENDPOINTS } from '../api/api.js';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore.js';

// Custom hook to manage delegations (Tasks).
export const useDelegations = () => {
    const queryClient = useQueryClient();
    const role = useAuthStore((state) => state.role);

    // 1. Fetch delegations (Logic based on role is handled by backend, but we hit different routes)
    const isUser = role === 'user';
    const delegationsQuery = useQuery({
        queryKey: ['delegations', role],
        queryFn: () => apiServices.get(isUser ? API_ENDPOINTS.DELEGATIONS.MY : API_ENDPOINTS.DELEGATIONS.BASE),
        staleTime: 1000 * 60 * 5,
    });

    // 2. Create delegation (Super/Admin)
    const createDelegationMutation = useMutation({
        mutationFn: (data) => apiServices.post(API_ENDPOINTS.DELEGATIONS.BASE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['delegations'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Task delegated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delegate task');
        },
    });

    // 3. Update status enforces ownership
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => apiServices.patch(API_ENDPOINTS.DELEGATIONS.STATUS(id), { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['delegations'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    // 4. Update full delegation (Admin / Superadmin)
    const updateDelegationMutation = useMutation({
        mutationFn: ({ id, ...data }) => apiServices.put(API_ENDPOINTS.DELEGATIONS.BY_ID(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['delegations'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Task updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update task');
        },
    });

    // 5. Delete delegation (Superadmin only)
    const deleteDelegationMutation = useMutation({
        mutationFn: (id) => apiServices.delete(API_ENDPOINTS.DELEGATIONS.BY_ID(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['delegations'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast.success('Task deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete task');
        },
    });

    return {
        delegations: delegationsQuery.data?.data || [],
        isLoading: delegationsQuery.isLoading,
        isError: delegationsQuery.isError,
        createDelegation: createDelegationMutation.mutate,
        isCreating: createDelegationMutation.isPending,
        updateStatus: updateStatusMutation.mutate,
        isUpdatingStatus: updateStatusMutation.isPending,
        updateDelegation: updateDelegationMutation.mutate,
        isUpdating: updateDelegationMutation.isPending,
        deleteDelegation: deleteDelegationMutation.mutate,
        isDeleting: deleteDelegationMutation.isPending,
    };
};
