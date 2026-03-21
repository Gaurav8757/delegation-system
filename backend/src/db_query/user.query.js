import { mysqlPool } from '../config/dbConfig.js';

// Get all users (excludes passwords and superadmin role). Used by superadmin.
export const getAllUsers = async () => {
    const [rows] = await mysqlPool.execute(
        "SELECT id, name, email, role, created_at FROM users WHERE role != 'superadmin' ORDER BY created_at DESC"
    );
    return rows;
};

// Get users filtered by role.
export const getUsersByRole = async (role) => {
    const [rows] = await mysqlPool.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
        [role]
    );
    return rows;
};

// Update a user's role.
export const updateUserRole = async (id, role) => {
    const [result] = await mysqlPool.execute(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id]
    );
    return result.affectedRows > 0;
};

// Delete a user by ID. (superadmin only)
export const deleteUser = async (id) => {
    const [result] = await mysqlPool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

// Count all users. (for dashboard stats)
export const getUserCount = async () => {
    const [[row]] = await mysqlPool.execute(
        'SELECT COUNT(*) AS total FROM users'
    );
    return row.total;
};

// Count users grouped by role. (for chart reports)
export const getUserCountByRole = async () => {
    const [rows] = await mysqlPool.execute(
        'SELECT role, COUNT(*) AS count FROM users GROUP BY role'
    );
    return rows;
};
