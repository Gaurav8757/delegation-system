import { Router } from 'express';
import {
    createDelegation,
    getAllDelegations,
    getMyDelegations,
    getDelegationById,
    updateDelegationStatus,
    updateFullDelegation,
    deleteDelegation,
} from '../controllers/delegation.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validateSchema } from '../middlewares/schemaValidatation.js';
import { createDelegationSchema, updateDelegationSchema, updateFullDelegationSchema } from '../validations/validateSchema.js';

const delegationRouter = Router();

/**
 * @swagger
 * /api/delegations/my:
 *   get:
 *     summary: Get delegations assigned to the current user
 *     tags: [Delegations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of own assigned delegations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Delegation' }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
delegationRouter.get('/my', authMiddleware, roleMiddleware(['user', 'admin', 'superadmin']), getMyDelegations);

/**
 * @swagger
 * /api/delegations:
 *   get:
 *     summary: Get all delegations (superadmin / admin only)
 *     tags: [Delegations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All delegations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Delegation' }
 *       403:
 *         description: Forbidden — insufficient role
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *   post:
 *     summary: Create a new delegation (superadmin / admin only)
 *     tags: [Delegations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, assigned_to]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Review Q1 Budget
 *               description:
 *                 type: string
 *                 example: Please review the attached Q1 budget spreadsheet
 *               assigned_to:
 *                 type: integer
 *                 example: 3
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 default: pending
 *     responses:
 *       201:
 *         description: Delegation created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Delegation created }
 *                 data: { $ref: '#/components/schemas/Delegation' }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Assigned user not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
delegationRouter.get('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), getAllDelegations);
delegationRouter.post('/', authMiddleware, roleMiddleware(['superadmin', 'admin']), validateSchema(createDelegationSchema), createDelegation);

/**
 * @swagger
 * /api/delegations/{id}:
 *   get:
 *     summary: Get a single delegation by ID
 *     tags: [Delegations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Delegation ID
 *     responses:
 *       200:
 *         description: Delegation record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { $ref: '#/components/schemas/Delegation' }
 *       404:
 *         description: Delegation not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
delegationRouter.get('/:id', authMiddleware, getDelegationById);

/**
 * @swagger
 * /api/delegations/{id}/status:
 *   patch:
 *     summary: Update delegation status (users can only update their own)
 *     tags: [Delegations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Delegation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: in-progress
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Status updated }
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ValidationError' }
 *       403:
 *         description: Forbidden — not your delegation
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Delegation not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
delegationRouter.patch('/:id/status', authMiddleware, validateSchema(updateDelegationSchema), updateDelegationStatus);
delegationRouter.put('/:id', authMiddleware, roleMiddleware(['superadmin', 'admin']), validateSchema(updateFullDelegationSchema), updateFullDelegation);

/**
 * @swagger
 * /api/delegations/{id}:
 *   delete:
 *     summary: Delete a delegation (superadmin only)
 *     tags: [Delegations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Delegation ID
 *     responses:
 *       200:
 *         description: Delegation deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Delegation deleted }
 *       403:
 *         description: Forbidden — superadmin only
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *       404:
 *         description: Delegation not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
delegationRouter.delete('/:id', authMiddleware, roleMiddleware(['superadmin']), deleteDelegation);

export default delegationRouter;
