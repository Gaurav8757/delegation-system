import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiServices, API_ENDPOINTS } from '../api/api.js';
import { useAuthStore } from '../store/authStore.js';
import toast from 'react-hot-toast';

// Custom hook to handle all authentication logic (Login, Logout, Register, GetMe).
export const useAuth = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);
    const queryClient = useQueryClient();

    // 1. Login Mutation
    const loginMutation = useMutation({
        mutationFn: (credentials) => apiServices.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
        onSuccess: (response) => {
            const { user, token } = response.data;
            setAuth(user, token);
            toast.success(`Welcome back, ${user.name}!`);
            queryClient.invalidateQueries({ queryKey: ['auth-me'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

    // 2. Register Mutation
    const registerMutation = useMutation({
        mutationFn: (data) => apiServices.post(API_ENDPOINTS.AUTH.REGISTER, data),
        onSuccess: (response) => {
            toast.success('Registration successful! Please login.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Registration failed');
        },
    });

    // 3. Get Me Query (verify session on reload)
    const getMeQuery = useQuery({
        queryKey: ['auth-me'],
        queryFn: () => apiServices.get(API_ENDPOINTS.AUTH.ME),
        enabled: !!localStorage.getItem('token'),
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: false,
    });

    // 4. Logout Function
    const handleLogout = async () => {
        try {
            await apiServices.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (err) {
            // Log logout attempt failed on server, but clear locally anyway
        } finally {
            logout();
            queryClient.clear();
            toast.success('Logged out successfully');
        }
    };

    return {
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        logout: handleLogout,
        user: getMeQuery.data?.data || useAuthStore.getState().user,
        isLoadingUser: getMeQuery.isLoading,
        isAuthenticated: useAuthStore((state) => state.isAuthenticated),
    };
};
