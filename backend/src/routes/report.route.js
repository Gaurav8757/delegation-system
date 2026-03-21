import { Router } from 'express';
import { getDashboardStats, getActivityReport } from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const reportRouter = Router();

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get dashboard statistics for charts
 *     description: |
 *       Returns delegation counts by status and user counts by role.
 *       - **superadmin / admin** — sees all data
 *       - **user** — sees only their own delegation stats
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     delegationsByStatus:
 *                       type: object
 *                       properties:
 *                         pending:    { type: integer, example: 5 }
 *                         in-progress: { type: integer, example: 3 }
 *                         completed:  { type: integer, example: 10 }
 *                     totalDelegations: { type: integer, example: 18 }
 *                     usersByRole:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         superadmin: { type: integer, example: 1 }
 *                         admin:      { type: integer, example: 2 }
 *                         user:       { type: integer, example: 15 }
 *                     totalUsers: { type: integer, nullable: true, example: 18 }
 *                     recentActivity:
 *                       type: array
 *                       nullable: true
 *                       items: { $ref: '#/components/schemas/ActivityLog' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
reportRouter.get('/dashboard', authMiddleware, getDashboardStats);

/**
 * @swagger
 * /api/reports/activity:
 *   get:
 *     summary: Get activity logs
 *     description: |
 *       - **superadmin** — sees the last 100 activity logs for all users and admins
 *       - **admin / user** — sees only their own activity logs
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [superadmin, admin, user]
 *         description: Filter logs by user role (Superadmin only)
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs by specific date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Activity log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ActivityLog' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
reportRouter.get('/activity', authMiddleware, getActivityReport);

export default reportRouter;
