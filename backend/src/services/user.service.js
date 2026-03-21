import {
    getAllUsers,
    getUsersByRole,
    updateUserRole,
    updateUser,
    deleteUser,
    getUserCount,
    getUserCountByRole,
} from '../db_query/user.query.js';
import { findUserByEmail, createUser } from '../db_query/auth.query.js';
import { logActivity } from '../db_query/activity.query.js';
import { hashPassword } from '../utils/hash.js';

// Get all users. (superadmin only)
export const getAllUsersService = async () => {
    return await getAllUsers();
};

// Create a user.
// - Admin can only create users with role 'user'.
// - Superadmin can create 'admin' or 'user'.
export const createUserByAdminService = async (data, creatorRole) => {
    const { name, email, password, role = 'user' } = data;
    if (role === 'superadmin') {
        const err = new Error('Cannot create another superadmin');
        err.statusCode = 403;
        throw err;
    }

    // Enforce role creation restrictions
    if (creatorRole === 'admin' && role !== 'user') {
        const err = new Error('Admin can only create users with role "user"');
        err.statusCode = 403;
        throw err;
    }
    if (creatorRole === 'user') {
        const err = new Error('Forbidden: Users cannot create other users');
        err.statusCode = 403;
        throw err;
    }

    // Check for duplicate email
    const existing = await findUserByEmail(email);
    if (existing) {
        const err = new Error('Email already registered');
        err.statusCode = 409;
        throw err;
    }

    const hashed = await hashPassword(password);
    const user = await createUser(name, email, hashed, role);

    logActivity(user.id, `Account created by ${creatorRole} with role: ${role}`).catch(() => {});
    return { id: user.id, name: user.name, email: user.email, role: user.role };
};

// Update a user's role. (superadmin only)
export const updateUserRoleService = async (targetId, newRole, requestorRole) => {
    if (requestorRole !== 'superadmin') {
        const err = new Error('Only superadmin can change user roles');
        err.statusCode = 403;
        throw err;
    }
    if (newRole === 'superadmin') {
        const err = new Error('Cannot promote to superadmin');
        err.statusCode = 403;
        throw err;
    }

    const updated = await updateUserRole(targetId, newRole);
    if (!updated) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return updated;
};

// Update a user. (superadmin only)
export const updateUserService = async (targetId, data, requestorRole) => {
    if (requestorRole !== 'superadmin') {
        const err = new Error('Only superadmin can update users');
        err.statusCode = 403;
        throw err;
    }

    const { name, email, role } = data;

    if (role === 'superadmin') {
        const err = new Error('Cannot promote to superadmin');
        err.statusCode = 403;
        throw err;
    }

    const updated = await updateUser(targetId, name, email, role);
    if (!updated) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return updated;
};

// Delete a user. (superadmin only)
export const deleteUserService = async (targetId, requestorId, requestorRole) => {
    if (requestorRole !== 'superadmin') {
        const err = new Error('Only superadmin can delete users');
        err.statusCode = 403;
        throw err;
    }
    if (Number(targetId) === Number(requestorId)) {
        const err = new Error('You cannot delete your own account');
        err.statusCode = 400;
        throw err;
    }

    const deleted = await deleteUser(targetId);
    if (!deleted) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    logActivity(requestorId, `Deleted user #${targetId}`).catch(() => {});
    return deleted;
};

// Get user count grouped by role. (for chart reports)
export const getUserStatsService = async () => {
    const [total, byRole] = await Promise.all([getUserCount(), getUserCountByRole()]);
    return { total, byRole };
};
