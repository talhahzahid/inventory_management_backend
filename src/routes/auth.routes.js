import express from "express";
import {
  changePasswordController,
  loginController,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// POST /api/v1/auth/login — user login, returns JWT token
router.post("/login", loginController);
router.patch("/change-password", authenticate, changePasswordController);

export default router;
