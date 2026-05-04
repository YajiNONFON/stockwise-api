import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/users/users.routes";
import { customerRouter } from "./modules/customers/customers.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/customers", customerRouter);

export default router;
