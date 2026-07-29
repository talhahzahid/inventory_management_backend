import express from 'express';
import {
  createCompanyController,
  getCompanyController,
} from '../controllers/company.controller.js';
import {authenticate} from '../middleware/auth.middleware.js';

const router = express.Router ();
router.post ('/create', createCompanyController);
router.get ('/', getCompanyController);
router.get ('/:id', getCompanyController);
// router.get ('/:id', getCompanyByIdController);

export default router;
