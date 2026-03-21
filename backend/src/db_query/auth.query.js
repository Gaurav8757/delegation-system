import { mysqlPool } from '../config/dbConfig.js';

// Returns the full row including the hashed password (needed for login verification).
export const findUserByEmail = async (email) => {
    const [rows] = await mysqlPool.execute(
        'SELECT id, name, email, password, role, created_at FROM users WHERE email = ? LIMIT 1',
        [email]
    );
    return rows[0] || null;
};

// Create a new user and return the newly inserted row.
export const createUser = async (name, email, hashedPassword, role = 'user') => {
    const [result] = await mysqlPool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
    );
    return { id: result.insertId, name, email, role };
};

// Find a user by their ID (used for token payload refresh / getMe).
export const findUserById = async (id) => {
    const [rows] = await mysqlPool.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
        [id]
    );
    return rows[0] || null;
};
