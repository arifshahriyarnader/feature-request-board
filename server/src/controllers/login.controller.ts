import { Request, Response } from "express";
import { LoginRequestBody } from "../types";
import { loginServices } from "../services";
export async function loginController(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> {
  const { type, email, password, refreshToken } = req.body;

  try {
    let result;

    if (type === "email") {
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      result = await loginServices.handleEmailLogin(email, password);
      res.json(result);
      return;
    }

    if (type === "refresh") {
      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is missing" });
        return;
      }

      result = await loginServices.refreshAccessToken(refreshToken);
      res.json(result);
      return;
    }

    res.status(400).json({ message: "Invalid login type" });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during login.";

    if (errorMessage.includes("not found")) {
      res.status(404).json({ message: errorMessage });
    } else if (
      errorMessage.includes("Invalid password") ||
      errorMessage.includes("Unauthorized")
    ) {
      res.status(401).json({ message: errorMessage });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}
