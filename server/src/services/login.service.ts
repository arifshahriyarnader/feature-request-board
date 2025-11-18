import dotenv from "dotenv";
dotenv.config();
import { User } from "../models";
import { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateUserObject } from "../utils";

const secret = process.env.JWT_SECRET!;

export async function handleEmailLogin(
  email: string,
  password: string
): Promise<any> {
  const user = (await User.findOne({ email })) as IUser;

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  return generateUserObject(user);
}

export async function refreshAccessToken(refreshToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret, async (err: any, payload: any) => {
      if (err) {
        return reject(new Error("Unauthorized: Invalid refresh token"));
      }

      const user = (await User.findById(payload._id)) as IUser;

      if (!user) {
        return reject(new Error("User not found"));
      }

      const userObj = generateUserObject(user);
      resolve(userObj);
    });
  });
}
