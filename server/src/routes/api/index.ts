import {Router} from "express";
import userRoutes from "./signup";
const router = Router();

router.use("/auth", userRoutes);

export default router;