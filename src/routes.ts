import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/users/users.routes";
import { customerRouter } from "./modules/customers/customers.routes";
import { productRouter } from "./modules/products/products.routes";
import { orderRouter } from "./modules/orders/orders.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/customers", customerRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/dashboard", dashboardRouter);

export default router;
