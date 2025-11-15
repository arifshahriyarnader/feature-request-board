import { Request, Response } from "express";
import { SignUpRequestBody } from "../types";
import { userSignupValidation } from "../validations";
import { signupServices } from "../services";

export const signupController = async (
  req: Request<{}, {}, SignUpRequestBody>,
  res: Response
) => {
  try {
    const parsed = userSignupValidation.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request data",
        errors: parsed.error.issues,
      });
    }
    const user = await signupServices.signupService(parsed.data);
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server error" });
  }
};
