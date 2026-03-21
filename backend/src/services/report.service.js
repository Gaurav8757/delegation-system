import { getDelegationStats, getDelegationStatsByUser } from '../db_query/delegation.query.js';
import { getUserCountByRole, getUserCount } from '../db_query/user.query.js';
import { getActivityLogsFiltered } from '../db_query/activity.query.js';

// Build the dashboard stats payload.
// - superadmin/admin: full stats (all delegations, all users, recent activity)
// - user: only their own delegation stats
export const getDashboardStatsService = async (requestUser) => {
    if (requestUser.role === 'user') {
        const [delegationStats] = await Promise.all([
            getDelegationStatsByUser(requestUser.id),
        ]);

        // Normalize array of {status, count} into an object
        const delegationsByStatus = { pending: 0, 'in-progress': 0, completed: 0 };
        for (const row of delegationStats) {
            delegationsByStatus[row.status] = Number(row.count);
        }

        const totalDelegations = Object.values(delegationsByStatus).reduce((a, b) => a + b, 0);

        return {
            delegationsByStatus,
            totalDelegations,
            usersByRole: null,
            totalUsers: null,
            recentActivity: null,
        };
    }

    // Admin / superadmin
    const [delegationStats, userStats, recentActivity, totalUsers] = await Promise.all([
        getDelegationStats(),
        getUserCountByRole(),
        getActivityLogsFiltered({ limit: 20 }),
        getUserCount(),
    ]);

    const delegationsByStatus = { pending: 0, 'in-progress': 0, completed: 0 };
    for (const row of delegationStats) {
        delegationsByStatus[row.status] = Number(row.count);
    }

    const usersByRole = { superadmin: 0, admin: 0, user: 0 };
    for (const row of userStats) {
        usersByRole[row.role] = Number(row.count);
    }

    const totalDelegations = Object.values(delegationsByStatus).reduce((a, b) => a + b, 0);

    return {
        delegationsByStatus,
        totalDelegations,
        usersByRole,
        totalUsers: Number(totalUsers),
        recentActivity,
    };
};


// Get all activity logs. (superadmin sees all, others see only their own)
export const getActivityReportService = async (requestUser, filters = {}) => {
    const { role, date } = filters;

    if (requestUser.role === 'superadmin') {
        // Superadmin: can filter by anything
        return await getActivityLogsFiltered({ role, date, limit: 100 });
    }

    // Admin / User: only their own logs (date filter still allowed)
    return await getActivityLogsFiltered({ userId: requestUser.id, date, limit: 100 });
};
