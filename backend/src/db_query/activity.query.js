import { mysqlPool } from '../config/dbConfig.js';

// Insert a new activity log entry.
export const logActivity = async (userId, action) => {
    await mysqlPool.execute(
        'INSERT INTO activity_logs (user_id, action) VALUES (?, ?)',
        [userId, action]
    );
};

// Retrieve activity logs with optional filters (role, date).
export const getActivityLogsFiltered = async ({ role, date, userId, limit = 100 }) => {
    let sql = `
        SELECT
            al.id, al.action, al.created_at,
            u.id   AS user_id,
            u.name AS user_name,
            u.role AS user_role
        FROM activity_logs al
        JOIN users u ON al.user_id = u.id
        WHERE 1=1
    `;
    const params = [];

    if (userId) {
        sql += ` AND al.user_id = ?`;
        params.push(userId);
    }

    if (role) {
        sql += ` AND u.role = ?`;
        params.push(role);
    }

    if (date) {
        // Assuming date is in 'YYYY-MM-DD' format
        sql += ` AND DATE(al.created_at) = ?`;
        params.push(date);
    }

    sql += ` ORDER BY al.created_at DESC LIMIT ?`;
    params.push(limit);

    const [rows] = await mysqlPool.execute(sql, params);
    return rows;
};
