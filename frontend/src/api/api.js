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

    async post(url, data, config = {}) {
        const response = await ApiRequestInstance.post(url, data, config);
        return response?.data;
    }

    async patch(url, data, config = {}) {
        const response = await ApiRequestInstance.patch(url, data, config);
        return response?.data;
    }

    async delete(url, config = {}) {
        const response = await ApiRequestInstance.delete(url, config);
        return response?.data;
    }
}

export const apiServices = new ApiServices();