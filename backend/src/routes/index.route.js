import { Router } from 'express';
import authRouter from './auth.route.js';
import delegationRouter from './delegation.route.js';
import userRouter from './user.route.js';
import reportRouter from './report.route.js';

const indexRouter = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/delegations', delegationRouter);
indexRouter.use('/users', userRouter);
indexRouter.use('/reports', reportRouter);

export default indexRouter;
