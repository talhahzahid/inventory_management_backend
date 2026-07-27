import express from 'express';
import roleRouter from './role.routes.js';
import companyRouter from './company.routes.js';
import userRouter from './user.routes.js';

const router = express.Router ();

router.use ('/roles', roleRouter);
router.use ('/companies', companyRouter);
router.use ('/users', userRouter);

export default router;
