import express from "express";
import {
  createPurchaseController,
  getAllPurchasesController,
  getPurchaseByIdController,
} from "../controllers/purchase.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.post(
  "/create",
  authorize(...PERMISSIONS.purchases.create),
  createPurchaseController,
);

router.get(
  "/",
  authorize(...PERMISSIONS.purchases.read),
  getAllPurchasesController,
);

router.get(
  "/:id",
  authorize(...PERMISSIONS.purchases.read),
  getPurchaseByIdController,
);

export default router;
