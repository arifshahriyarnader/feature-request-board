import {Router} from "express";
import signupRoutes from "./signup";
import googleAuthRoutes from "./google-oauth";
import loginRoutes from "./login";

const router = Router();

router.use("/auth", signupRoutes);
router.use("/auth", googleAuthRoutes);
router.use("/auth", loginRoutes)

export default router;