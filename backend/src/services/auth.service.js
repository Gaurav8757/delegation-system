import { findUserByEmail, createUser, findUserById } from '../db_query/auth.query.js';
import { logActivity } from '../db_query/activity.query.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Register a new user.
 * - Rejects duplicate emails.
 * - Hashes password with argon2.
 * - Logs the registration action.
 */
export const registerService = async (name, email, password, role = 'user') => {
    // Check for duplicate email
    const existing = await findUserByEmail(email);
    if (existing) {
        const err = new Error('Email already registered');
        err.statusCode = 409;
        throw err;
    }

    const hashed = await hashPassword(password);
    const user = await createUser(name, email, hashed, role);

    // Fire-and-forget activity log
    logActivity(user.id, `User registered with role: ${role}`).catch(() => {});

    return { id: user.id, name: user.name, email: user.email, role: user.role };
};

// Authenticate a user and return a signed JWT.
export const loginService = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const token = generateToken({ id: user.id, role: user.role, name: user.name });

    // Fire-and-forget activity log
    logActivity(user.id, 'User logged in').catch(() => {});

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
};

// Return the currently authenticated user's profile (no password).
export const getMeService = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return user;
};

// Log the logout action. (Token invalidation is handled client-side)
export const logoutService = async (userId) => {
    logActivity(userId, 'User logged out').catch(() => {});
};
