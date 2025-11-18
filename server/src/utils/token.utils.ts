import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

export function generateTokens(user: IUser) {
  const secret = process.env.JWT_SECRET!;

  const payload = {
    email: user.email,
    _id: user._id,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, secret, { expiresIn: "1d" });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: "30d" });

  return { accessToken, refreshToken };
}

export function generateUserObject(user: IUser) {
  const { accessToken, refreshToken } = generateTokens(user);
  const userObj = user.toJSON();
  userObj.accessToken = accessToken;
  userObj.refreshToken = refreshToken;
  return userObj;
}