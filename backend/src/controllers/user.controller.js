import {
    getAllUsersService,
    createUserByAdminService,
    updateUserRoleService,
    updateUserService,
    deleteUserService,
} from '../services/user.service.js';

/** GET /api/users — superadmin only */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** POST /api/users — superadmin / admin */
export const createUser = async (req, res, next) => {
    try {
        const user = await createUserByAdminService(req.body, req.user.role);
        res.status(201).json({ success: true, message: 'User created', data: user });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** PATCH /api/users/:id/role — superadmin only */
export const updateUserRole = async (req, res, next) => {
    try {
        await updateUserRoleService(req.params.id, req.body.role, req.user.role);
        res.status(200).json({ success: true, message: 'User role updated' });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** PUT /api/users/:id — superadmin only */
export const updateUser = async (req, res, next) => {
    try {
        await updateUserService(req.params.id, req.body, req.user.role);
        res.status(200).json({ success: true, message: 'User updated' });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** DELETE /api/users/:id — superadmin only */
export const deleteUser = async (req, res, next) => {
    try {
        await deleteUserService(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};
