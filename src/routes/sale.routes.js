import express from "express";
import {
  createSaleController,
  getAllSalesController,
  getSaleByIdController,
  getSalesSummaryController,
} from "../controllers/sale.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.post(
  "/create",
  authorize(...PERMISSIONS.sales.create),
  createSaleController,
);

router.get(
  "/summary",
  authorize(...PERMISSIONS.sales.read),
  getSalesSummaryController,
);

router.get("/", authorize(...PERMISSIONS.sales.read), getAllSalesController);

router.get(
  "/:id",
  authorize(...PERMISSIONS.sales.read),
  getSaleByIdController,
);

export default router;
