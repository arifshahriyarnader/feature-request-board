import { Router } from "express";

import { signupController } from "../../controllers";

const router = Router();

router.post("/signup", signupController.signupController);

export default router;
