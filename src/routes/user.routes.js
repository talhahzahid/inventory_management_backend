import express from 'express';
import {
  createUserController,
  getAllUsersController,
  getUsersByIdController,
} from '../controllers/user.controller.js';

const router = express.Router ();

router.post ('/create', createUserController);
router.get ('/', getAllUsersController);
router.get ('/:id', getUsersByIdController);

export default router;
