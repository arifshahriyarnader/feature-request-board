import dotenv from "dotenv";
dotenv.config();
import { Router, Request, Response } from "express";
import { User } from "../../models";
import { IUser } from "../../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginRequestBody } from "../../types";

const router = Router();

router.post(
  "/login",
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response
  ): Promise<any> => {
    try {
      const { type, email, password, refreshToken } = req.body;

      if (type === "email") {
        const user = (await User.findOne({ email })) as IUser;

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return await handleEmailLogin({ password, user, res });
      }

      if (type === "refresh") {
        if (!refreshToken) {
          return res.status(401).json({ message: "Refresh token is missing" });
        }

        return await handleRefreshToken({ refreshToken, res });
      }

      return res.status(400).json({ message: "Invalid login type" });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

export default router;

async function handleEmailLogin({
  password,
  user,
  res,
}: {
  password: string;
  user: IUser;
  res: Response;
}) {
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const userObj = generateUserObject(user);
  return res.json(userObj);
}

function generateUserObject(user: IUser) {
  const { accessToken, refreshToken } = generateTokens(user);
  const userObj = user.toJSON();
  userObj.accessToken = accessToken;
  userObj.refreshToken = refreshToken;
  return userObj;
}

function generateTokens(user: IUser) {
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

async function handleRefreshToken({
  refreshToken,
  res,
}: {
  refreshToken: string;
  res: Response;
}) {
  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET!,
    async (err: any, payload: any) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = (await User.findById(payload._id)) as IUser;

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userObj = generateUserObject(user);
      return res.status(200).json(userObj);
    }
  );
}
