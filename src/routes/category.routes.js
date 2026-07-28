import express from 'express';
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deactivateCategoryController,
} from '../controllers/category.controller.js';
import {authenticate, authorize} from '../middleware/auth.middleware.js';
import {tenantScope} from '../middleware/tenant.middleware.js';
import {PERMISSIONS} from '../config/permissions.js';

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.post(
  '/create',
  authorize(...PERMISSIONS.categories.create),
  createCategoryController
);

router.get(
  '/',
  authorize(...PERMISSIONS.categories.read),
  getAllCategoriesController
);

router.get(
  '/:id',
  authorize(...PERMISSIONS.categories.read),
  getCategoryByIdController
);

router.put(
  '/:id',
  authorize(...PERMISSIONS.categories.update),
  updateCategoryController
);

router.delete(
  '/:id',
  authorize(...PERMISSIONS.categories.delete),
  deactivateCategoryController
);

export default router;
