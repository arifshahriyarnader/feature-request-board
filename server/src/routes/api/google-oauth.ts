import { Router } from "express";
import { googleOAuthController } from "../../controllers";

const router = Router();

router.get("/google", googleOAuthController.googleLogin);

router.get("/google/callback", googleOAuthController.googleCallback);

export default router;
