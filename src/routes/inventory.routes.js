import express from "express";
import {
  getAllInventoryController,
  getInventoryByIdController,
  updateInventoryController,
  adjustStockController,
} from "../controllers/inventory.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.get(
  "/",
  authorize(...PERMISSIONS.inventory.read),
  getAllInventoryController,
);

router.get(
  "/:id",
  authorize(...PERMISSIONS.inventory.read),
  getInventoryByIdController,
);

router.put(
  "/:id",
  authorize(...PERMISSIONS.inventory.update),
  updateInventoryController,
);

router.patch(
  "/:id/adjust",
  authorize(...PERMISSIONS.inventory.update),
  adjustStockController,
);

export default router;
