import express from 'express';
import {
  createCompanyController,
  getCompanyController,
} from '../controllers/company.controller.js';

const router = express.Router ();

router.post ('/create/company', createCompanyController);
router.get ('/get-all', getCompanyController);
export default router;
