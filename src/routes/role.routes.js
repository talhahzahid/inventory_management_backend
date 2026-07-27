import express from 'express';
import {createRoleController} from '../controllers/role.controller.js';

const router = express.Router();

// POST /api/v1/roles — create a new role (admin, manager, employee)
router.post('/', createRoleController);

export default router;
