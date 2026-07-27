import express from 'express';
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deactivateCategoryController,
} from '../controllers/category.controller.js';
import {authenticate} from '../middleware/auth.middleware.js';

const router = express.Router ();

router.use (authenticate);

router.post ('/create', createCategoryController);

router.get ('/', getAllCategoriesController);

router.get ('/:id', getCategoryByIdController);

router.put ('/:id', updateCategoryController);

router.delete ('/:id', deactivateCategoryController);

export default router;
