import ApiRequestInstance from "./axios_instances.js";

// Centralized API endpoints for the system.
// - All methods return data directly or throw errors for React Query to handle.

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },
    USERS: {
        BASE: '/users',
        BY_ID: (id) => `/users/${id}`,
        ROLE: (id) => `/users/${id}/role`,
    },
    DELEGATIONS: {
        BASE: '/delegations',
        MY: '/delegations/my',
        BY_ID: (id) => `/delegations/${id}`,
        STATUS: (id) => `/delegations/${id}/status`,
    },
    REPORTS: {
        DASHBOARD: '/reports/dashboard',
        ACTIVITY: '/reports/activity',
    }
};

class ApiServices {
    async get(url, params = {}) {
        const response = await ApiRequestInstance.get(url, { params });
        return response?.data;
    }

    async post(url, data) {
        const response = await ApiRequestInstance.post(url, data);
        return response?.data;
    }

    async patch(url, data) {
        const response = await ApiRequestInstance.patch(url, data);
        return response?.data;
    }

    async put(url, data) {
        const response = await ApiRequestInstance.put(url, data);
        return response?.data;
    }

    async delete(url) {
        const response = await ApiRequestInstance.delete(url);
        return response?.data;
    }
}

export const apiServices = new ApiServices();