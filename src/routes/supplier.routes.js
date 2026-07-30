import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import {
  createSupplierController,
  getAllSupplierController,
  updateSupplierController,
  deactivateSupplierController,
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

router.put(
  "/:id",
  authorize(...PERMISSIONS.suppliers.update),
  updateSupplierController,
);

router.delete(
  "/:id",
  authorize(...PERMISSIONS.suppliers.delete),
  deactivateSupplierController,
);

export default router;
