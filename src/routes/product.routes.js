import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deactivateProductController,
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.post(
  "/create",
  authorize(...PERMISSIONS.products.create),
  createProductController,
);

router.get(
  "/",
  authorize(...PERMISSIONS.products.read),
  getAllProductsController,
);

router.get(
  "/:id",
  authorize(...PERMISSIONS.products.read),
  getProductByIdController,
);

router.put(
  "/:id",
  authorize(...PERMISSIONS.products.update),
  updateProductController,
);

router.delete(
  "/:id",
  authorize(...PERMISSIONS.products.delete),
  deactivateProductController,
);

export default router;
