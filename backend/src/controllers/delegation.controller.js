import {
    createDelegationService,
    getAllDelegationsService,
    getUserDelegationsService,
    getDelegationByIdService,
    updateDelegationStatusService,
    deleteDelegationService,
} from '../services/delegation.service.js';

/** POST /api/delegations */
export const createDelegation = async (req, res, next) => {
    try {
        const delegation = await createDelegationService(req.body, req.user.id);
        res.status(201).json({ success: true, message: 'Delegation created', data: delegation });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** GET /api/delegations — all (superadmin / admin) */
export const getAllDelegations = async (req, res, next) => {
    try {
        const delegations = await getAllDelegationsService();
        res.status(200).json({ success: true, data: delegations });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** GET /api/delegations/my — own assigned delegations (user) */
export const getMyDelegations = async (req, res, next) => {
    try {
        const delegations = await getUserDelegationsService(req.user.id);
        res.status(200).json({ success: true, data: delegations });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** GET /api/delegations/:id */
export const getDelegationById = async (req, res, next) => {
    try {
        const delegation = await getDelegationByIdService(req.params.id);
        res.status(200).json({ success: true, data: delegation });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** PATCH /api/delegations/:id/status */
export const updateDelegationStatus = async (req, res, next) => {
    try {
        const updated = await updateDelegationStatusService(req.params.id, req.body.status, req.user);
        res.status(200).json({ success: true, message: 'Status updated', updated });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};

/** DELETE /api/delegations/:id — superadmin only */
export const deleteDelegation = async (req, res, next) => {
    try {
        await deleteDelegationService(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Delegation deleted' });
    } catch (err) {
        res.status(err.statusCode || 500);
        next(err);
    }
};
