import dotenv from "dotenv";
dotenv.config();

import { Router, Request, Response } from "express";
import axios from "axios";
import qs from "qs";
import jwt from "jsonwebtoken";
import { OAuthUser } from "../../models";

const router = Router();

router.get("/google", (req: Request, res: Response) => {
  const redirectURL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile&access_type=offline&prompt=consent`;
  res.redirect(redirectURL);
});

router.get("/google/callback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    const tokenResponse = await axios.post(
      process.env.GOOGLE_TOKEN_URL!,
      qs.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(500).json({ message: "Failed to get access token" });
    }

    const userInfoResponse = await axios.get(process.env.GOOGLE_USERINFO_URL!, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { email, name } = userInfoResponse.data;
    if (!email)
      return res.status(500).json({ message: "Failed to get user email" });

    let user = await OAuthUser.findOne({ email, provider: "google" });

    if (!user) {
      user = await OAuthUser.create({
        name: name || "No Name",
        email,
        provider: "google",
        role: "user",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, provider: user.provider },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google OAuth login successful",
      token,
      user,
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Response:", error.response?.data);
    } else {
      console.error("Error:", error);
    }
    res.status(500).json({ message: "OAuth login failed" });
  }
});

export default router;
