import express from "express";
import {
  createRoleController,
  getAllRolesController,
  getRoleByIdController,
} from "../controllers/role.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

router.use(authenticate);

router.post(
  '/create',
  authorize(...PERMISSIONS.roles.create),
  createRoleController
);

router.get("/", authorize(...PERMISSIONS.roles.read), getAllRolesController);

router.get("/:id", authorize(...PERMISSIONS.roles.read), getRoleByIdController);

export default router;
