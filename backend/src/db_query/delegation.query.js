import { mysqlPool } from '../config/dbConfig.js';

// Get all delegations with creator and assignee names.
export const getAllDelegations = async () => {
    const [rows] = await mysqlPool.execute(`
        SELECT
            d.id, d.title, d.description, d.status, d.created_at,
            a.id   AS assigned_to_id,   a.name AS assigned_to_name,
            c.id   AS created_by_id,    c.name AS created_by_name
        FROM delegations d
        JOIN users a ON d.assigned_to = a.id
        JOIN users c ON d.created_by  = c.id
        ORDER BY d.created_at DESC
    `);
    return rows;
};

// Get delegations assigned to a specific user.
export const getDelegationsByUser = async (userId) => {
    const [rows] = await mysqlPool.execute(`
        SELECT
            d.id, d.title, d.description, d.status, d.created_at,
            c.name AS created_by_name
        FROM delegations d
        JOIN users c ON d.created_by = c.id
        WHERE d.assigned_to = ?
        ORDER BY d.created_at DESC
    `, [userId]);
    return rows;
};

// Get delegations created by a specific user.
export const getDelegationsByCreator = async (createdBy) => {
    const [rows] = await mysqlPool.execute(`
        SELECT
            d.id, d.title, d.description, d.status, d.created_at,
            a.name AS assigned_to_name
        FROM delegations d
        JOIN users a ON d.assigned_to = a.id
        WHERE d.created_by = ?
        ORDER BY d.created_at DESC
    `, [createdBy]);
    return rows;
};

// Get a single delegation by its ID.
export const getDelegationById = async (id) => {
    const [rows] = await mysqlPool.execute(`
        SELECT
            d.id, d.title, d.description, d.status, d.created_at,
            a.id   AS assigned_to_id,   a.name AS assigned_to_name,
            c.id   AS created_by_id,    c.name AS created_by_name
        FROM delegations d
        JOIN users a ON d.assigned_to = a.id
        JOIN users c ON d.created_by  = c.id
        WHERE d.id = ?
        LIMIT 1
    `, [id]);
    return rows[0] || null;
};

// Create a new delegation.
export const createDelegation = async (title, description, assigned_to, created_by, status = 'pending') => {
    const [result] = await mysqlPool.execute(
        'INSERT INTO delegations (title, description, assigned_to, created_by, status) VALUES (?, ?, ?, ?, ?)',
        [title, description || null, assigned_to, created_by, status]
    );
    return { id: result.insertId, title, description, assigned_to, created_by, status };
};

// Update a delegation's status.
export const updateDelegationStatus = async (id, status) => {
    const [result] = await mysqlPool.execute(
        'UPDATE delegations SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};

// Update a full delegation.
export const updateDelegation = async (id, title, description, assigned_to, status) => {
    const [result] = await mysqlPool.execute(
        'UPDATE delegations SET title = ?, description = ?, assigned_to = ?, status = ? WHERE id = ?',
        [title, description || null, assigned_to, status, id]
    );
    return result.affectedRows > 0;
};

// Delete a delegation by ID. (superadmin only)
export const deleteDelegation = async (id) => {
    const [result] = await mysqlPool.execute(
        'DELETE FROM delegations WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

// Get delegation counts grouped by status. (for chart reports)
export const getDelegationStats = async () => {
    const [rows] = await mysqlPool.execute(`
        SELECT status, COUNT(*) AS count
        FROM delegations
        GROUP BY status
    `);
    return rows;
};

// Get delegation counts grouped by status for a specific user.
export const getDelegationStatsByUser = async (userId) => {
    const [rows] = await mysqlPool.execute(`
        SELECT status, COUNT(*) AS count
        FROM delegations
        WHERE assigned_to = ?
        GROUP BY status
    `, [userId]);
    return rows;
};
