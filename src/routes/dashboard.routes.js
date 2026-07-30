import express from "express";
import { getDashboardSummaryController } from "../controllers/dashboard.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.get(
  "/summary",
  authorize(...PERMISSIONS.dashboard.read),
  getDashboardSummaryController,
);

export default router;
