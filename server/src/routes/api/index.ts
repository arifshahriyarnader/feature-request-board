import {Router} from "express";
import signupRoutes from "./signup";
import googleAuthRoutes from "./google-auth";
const router = Router();

router.use("/auth", signupRoutes);
router.use("/auth", googleAuthRoutes);

export default router;