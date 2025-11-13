import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { SignUpRequestBody } from "../../types";
import { userSignupValidation } from "../../validations";
import { User } from "../../models";

const router = Router();

router.post(
  "/signup",
  async (
    req: Request<{}, {}, SignUpRequestBody>,
    res: Response
  ): Promise<void> => {
    try {
      const parsed = userSignupValidation.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid request data",
          errors: parsed.error.issues,
        });
        return;
      }
      const { name, email, password, role } = parsed.data;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      });
      await user.save();
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);
export default router;
