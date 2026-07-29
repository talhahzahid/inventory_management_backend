import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import {
  createSupplierController,
  getAllSupplierController,
} from "../controllers/supplier.controller.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.post(
  "/create",
  authorize(...PERMISSIONS.suppliers.create),
  createSupplierController,
);

router.get(
  "/",
  authorize(...PERMISSIONS.suppliers.read),
  getAllSupplierController,
);

router.get(
  "/:id",
  authorize(...PERMISSIONS.suppliers.read),
  getAllSupplierController,
);

// router.get(
//   '/:id',
//   authorize(...PERMISSIONS.categories.read),
//   getCategoryByIdController
// );

// router.put(
//   '/:id',
//   authorize(...PERMISSIONS.categories.update),
//   updateCategoryController
// );

// router.delete(
//   '/:id',
//   authorize(...PERMISSIONS.categories.delete),
//   deactivateCategoryController
// );

export default router;
