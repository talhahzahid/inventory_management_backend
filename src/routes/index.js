import express from "express";
import authRouter from "./auth.routes.js";
import roleRouter from "./role.routes.js";
import companyRouter from "./company.routes.js";
import userRouter from "./user.routes.js";
import categoryRouter from "./category.routes.js";
import supplierRouter from "./supplier.routes.js";
import productRouter from "./product.routes.js";
import inventoryRouter from "./inventory.routes.js";
import saleRouter from "./sale.routes.js";
import purchaseRouter from "./purchase.routes.js";
import dashboardRouter from "./dashboard.routes.js";

const router = express.Router();

// Base: /api/v1
router.use("/auth", authRouter); // login
router.use("/roles", roleRouter); // role management
router.use("/companies", companyRouter); // company registration & listing
router.use("/users", userRouter); // user management
router.use("/categories", categoryRouter); // category CRUD
router.use("/supplier", supplierRouter);
router.use("/products", productRouter);
router.use("/inventory", inventoryRouter);
router.use("/sales", saleRouter);
router.use("/purchases", purchaseRouter);
router.use("/dashboard", dashboardRouter);
export default router;
