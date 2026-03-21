import {
    registerService,
    loginService,
    getMeService,
    logoutService,
} from '../services/auth.service.js';

// POST /api/auth/register — public
export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await registerService(name, email, password, role);
        res.status(201).json({ success: true, message: 'Registration successful', data: user });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** POST /api/auth/login */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await loginService(email, password);
        res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** GET /api/auth/me — requires authMiddleware */
export const getMe = async (req, res, next) => {
    try {
        const user = await getMeService(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** POST /api/auth/logout — requires authMiddleware */
export const logout = async (req, res, next) => {
    try {
        await logoutService(req.user.id);
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};
