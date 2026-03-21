import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiServices, API_ENDPOINTS } from '../api/api.js';
import toast from 'react-hot-toast';

// Custom hook to manage users (Superadmin only).
export const useUsers = () => {
    const queryClient = useQueryClient();

    // 1. Fetch all users
    const usersQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => apiServices.get(API_ENDPOINTS.USERS.BASE),
        staleTime: 1000 * 60 * 5,
    });

    // 2. Create user (Super/Admin)
    const createUserMutation = useMutation({
        mutationFn: (data) => apiServices.post(API_ENDPOINTS.USERS.BASE, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create user');
        },
    });

    // 3. Update user role (Superadmin only)
    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }) => apiServices.patch(API_ENDPOINTS.USERS.ROLE(id), { role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User role updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update role');
        },
    });

    // 4. Update full user (Superadmin only)
    const updateUserMutation = useMutation({
        mutationFn: ({ id, ...data }) => apiServices.put(API_ENDPOINTS.USERS.BY_ID(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update user');
        },
    });

    // 5. Delete user (Superadmin only)
    const deleteUserMutation = useMutation({
        mutationFn: (id) => apiServices.delete(API_ENDPOINTS.USERS.BY_ID(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        },
    });

    return {
        users: usersQuery.data?.data || [],
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        createUser: createUserMutation.mutate,
        isCreating: createUserMutation.isPending,
        updateRole: updateRoleMutation.mutate,
        isUpdatingRole: updateRoleMutation.isPending,
        updateUser: updateUserMutation.mutate,
        isUpdating: updateUserMutation.isPending,
        deleteUser: deleteUserMutation.mutate,
        isDeleting: deleteUserMutation.isPending,
    };
};
