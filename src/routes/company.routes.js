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
import { uploadImageToCloudinary } from "../utils/upload.js";

const router = express.Router();

router.post("/create", upload.single("logo"), createCompanyController);

// router.post("/uploads", upload.single("image"), async (req, res, next) => {
//   console.log(req.file);
//   const result = await uploadImageToCloudinary(req.file.path);
//   console.log(result, "upload result");
//   next();
// });

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
