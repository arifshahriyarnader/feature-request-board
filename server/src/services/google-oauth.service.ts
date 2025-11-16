import axios from "axios";
import qs from "qs";
import { OAuthUser } from "../models";
import jwt from "jsonwebtoken";

export const getGoogleTokens = async (code: string) => {
  const response = await axios.post(
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

  return response.data;
};

export const getGoogleUserInfo = async (accessToken: string) => {
  const response = await axios.get(process.env.GOOGLE_USERINFO_URL!, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const findOrCreateOAuthUser = async (email: string, name: string) => {
  let user = await OAuthUser.findOne({ email, provider: "google" });

  if (!user) {
    user = await OAuthUser.create({
      name: name || "No Name",
      email,
      provider: "google",
      role: "user",
    });
  }

  return user;
};

export const generateOAuthJWT = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email, provider: user.provider },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};
