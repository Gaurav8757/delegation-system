import {
    getDashboardStatsService,
    getActivityReportService,
} from '../services/report.service.js';

/** GET /api/reports/dashboard */
export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await getDashboardStatsService(req.user);
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** GET /api/reports/activity */
export const getActivityReport = async (req, res, next) => {
    try {
        const { role, date } = req.query;
        const logs = await getActivityReportService(req.user, { role, date });
        res.status(200).json({ success: true, data: logs });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};
