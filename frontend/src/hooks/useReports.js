import { useQuery } from '@tanstack/react-query';
import { apiServices, API_ENDPOINTS } from '../api/api.js';

// Custom hook to manage reports and activity logs.
export const useReports = (filters = {}) => {
    // 1. Fetch dashboard summary
    const dashboardQuery = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => apiServices.get(API_ENDPOINTS.REPORTS.DASHBOARD),
        staleTime: 1000 * 60 * 5,
    });

    // 2. Fetch activity logs with filters (role, date)
    const activityQuery = useQuery({
        queryKey: ['activity-logs', filters],
        queryFn: () => apiServices.get(API_ENDPOINTS.REPORTS.ACTIVITY, filters),
        staleTime: 1000 * 60 * 2,
    });

    return {
        stats: dashboardQuery.data?.data || {},
        isStatsLoading: dashboardQuery.isLoading,
        logs: activityQuery.data?.data || [],
        isLogsLoading: activityQuery.isLoading,
        isLogsError: activityQuery.isError,
        refetchLogs: activityQuery.refetch
    };
};
