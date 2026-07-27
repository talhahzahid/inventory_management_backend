import express from 'express';
import {loginController} from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/v1/auth/login — user login, returns JWT token
router.post('/login', loginController);

export default router;
