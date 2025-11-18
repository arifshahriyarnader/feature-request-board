
import { Router } from "express";
import { loginController } from "../../controllers";

const router = Router();

router.post("/login", loginController.loginController);

export default router;
