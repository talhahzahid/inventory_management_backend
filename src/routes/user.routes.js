import express from 'express';
import {
  createUserController,
  getAllUsersController,
  getUsersByIdController,
} from '../controllers/user.controller.js';
import {authenticate} from '../middleware/auth.middleware.js';

const router = express.Router ();

router.use (authenticate);

router.post ('/create', createUserController);
router.get ('/', getAllUsersController);
// router.get ('/:id', getUserByIdController);

export default router;
