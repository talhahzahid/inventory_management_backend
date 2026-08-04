import express from "express";
import {
  createCompanyController,
  getCompanyController,
  updateCompanyController,
  deactivateCompanyController,
} from "../controllers/company.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/create", createCompanyController);

router.post("/uploads", upload.single("image"), (req, res , next) => {
  console.log(req.file);
  next()
});

router.get(
  "/",
  authenticate,
  authorize(...PERMISSIONS.companies.read),
  getCompanyController,
);

router.get(
  "/:id",
  authenticate,
  authorize(...PERMISSIONS.companies.read),
  getCompanyController,
);

router.put(
  "/:id",
  authenticate,
  authorize(...PERMISSIONS.companies.update),
  updateCompanyController,
);

router.delete(
  "/:id",
  authenticate,
  authorize(...PERMISSIONS.companies.delete),
  deactivateCompanyController,
);

export default router;
