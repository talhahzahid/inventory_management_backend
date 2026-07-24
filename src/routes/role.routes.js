import express from 'express';
import {createRoleController} from '../controllers/role.controller.js';

const router = express.Router ();

router.post ('/create/role', createRoleController);

export default router;
