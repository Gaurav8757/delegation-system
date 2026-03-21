import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Manage user authentication state, token, and role globally.
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: localStorage.getItem('token') || null,
            isAuthenticated: !!localStorage.getItem('token'),
            role: null,

            // Login successful: Save user data and token.
            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true, role: user?.role });
            },

            // Logout: Clear all session and state.
            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false, role: null });
            },

            // Update user profile info.
            setUser: (user) => set({ user, role: user?.role }),
        }),
        {
            name: 'auth-storage', // Key for localStorage
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, role: state.role }), // Don't persist sensitive token in serialized JSON if possible (token already in localStorage)
        }
    )
);
