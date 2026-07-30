import express from "express";
import {
  createUserController,
  getAllUsersController,
  getUsersByIdController,
  updateUserController,
  deactivateUserController,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { tenantScope } from "../middleware/tenant.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);
router.use(tenantScope);

router.post(
  "/create",
  authorize(...PERMISSIONS.users.create),
  createUserController,
);

router.get("/", authorize(...PERMISSIONS.users.read), getAllUsersController);

router.get(
  "/:id",
  authorize(...PERMISSIONS.users.read),
  getUsersByIdController,
);

router.put(
  "/:id",
  authorize(...PERMISSIONS.users.update),
  updateUserController,
);

router.delete(
  "/:id",
  authorize(...PERMISSIONS.users.delete),
  deactivateUserController,
);

export default router;
