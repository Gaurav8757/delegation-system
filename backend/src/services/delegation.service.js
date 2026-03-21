import {
    createDelegation,
    getAllDelegations,
    getDelegationsByUser,
    getDelegationById,
    updateDelegationStatus,
    updateDelegation,
    deleteDelegation,
    getDelegationStats,
    getDelegationStatsByUser,
} from '../db_query/delegation.query.js';
import { findUserById } from '../db_query/auth.query.js';
import { logActivity } from '../db_query/activity.query.js';

// Create a new delegation.
// Validates that the assigned user exists.
export const createDelegationService = async (data, createdBy) => {
    const { title, description, assigned_to, status } = data;

    // Ensure the assigned user exists
    const assignee = await findUserById(assigned_to);
    if (!assignee) {
        const err = new Error(`User with id ${assigned_to} does not exist`);
        err.statusCode = 404;
        throw err;
    }

    const delegation = await createDelegation(title, description, assigned_to, createdBy, status);
    logActivity(createdBy, `Created delegation: "${title}"`).catch(() => {});
    return delegation;
};

// Get all delegations. (superadmin / admin)
export const getAllDelegationsService = async () => {
    return await getAllDelegations();
};

// Get delegations assigned to a specific user. (user role)
export const getUserDelegationsService = async (userId) => {
    return await getDelegationsByUser(userId);
};

// Get a single delegation by ID.
export const getDelegationByIdService = async (id) => {
    const delegation = await getDelegationById(id);
    if (!delegation) {
        const err = new Error('Delegation not found');
        err.statusCode = 404;
        throw err;
    }
    return delegation;
};

// Update a delegation's status.
// - If the requester has role 'user', enforces ownership (must be assigned_to).
export const updateDelegationStatusService = async (id, status, requestUser) => {
    const delegation = await getDelegationById(id);
    if (!delegation) {
        const err = new Error('Delegation not found');
        err.statusCode = 404;
        throw err;
    }

    // Users can only update their own assigned delegations
    if (requestUser.role === 'user' && delegation.assigned_to_id !== requestUser.id) {
        const err = new Error('Forbidden: You can only update your own delegations');
        err.statusCode = 403;
        throw err;
    }

    const updated = await updateDelegationStatus(id, status);
    if (updated) {
        logActivity(requestUser.id, `Updated delegation #${id} status to: ${status}`).catch(() => {});
    }
    return updated;
};

// Update a full delegation. (superadmin / admin only)
export const updateFullDelegationService = async (id, data, requestUser) => {
    if (requestUser.role === 'user') {
        const err = new Error('Forbidden: Users cannot update delegation details');
        err.statusCode = 403;
        throw err;
    }

    const delegation = await getDelegationById(id);
    if (!delegation) {
        const err = new Error('Delegation not found');
        err.statusCode = 404;
        throw err;
    }

    const { title, description, assigned_to, status } = data;

    // Ensure the assigned user exists
    const assignee = await findUserById(assigned_to);
    if (!assignee) {
        const err = new Error(`User with id ${assigned_to} does not exist`);
        err.statusCode = 404;
        throw err;
    }

    const updated = await updateDelegation(id, title, description, assigned_to, status);
    if (updated) {
        logActivity(requestUser.id, `Updated delegation #${id}: "${title}"`).catch(() => {});
    }
    return updated;
};

// Delete a delegation. (superadmin only)
export const deleteDelegationService = async (id, requestUserId) => {
    const delegation = await getDelegationById(id);
    if (!delegation) {
        const err = new Error('Delegation not found');
        err.statusCode = 404;
        throw err;
    }

    const deleted = await deleteDelegation(id);
    if (deleted) {
        logActivity(requestUserId, `Deleted delegation #${id}: "${delegation.title}"`).catch(() => {});
    }
    return deleted;
};

// Get delegation status stats for chart reports.
// - Users only see their own stats.
export const getDelegationStatsService = async (requestUser) => {
    if (requestUser.role === 'user') {
        return await getDelegationStatsByUser(requestUser.id);
    }
    return await getDelegationStats();
};
