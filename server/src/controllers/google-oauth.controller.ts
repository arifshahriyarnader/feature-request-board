import { Request, Response } from "express";
import { googleOAuthServices } from "../services";

export const googleLogin = (req: Request, res: Response) => {
  const redirectURL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile&access_type=offline&prompt=consent`;

  res.redirect(redirectURL);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    if (!code)
      return res.status(400).json({ message: "Authorization code missing" });

    const tokens = await googleOAuthServices.getGoogleTokens(code);
    const accessToken = tokens.access_token;

    const googleUser = await googleOAuthServices.getGoogleUserInfo(accessToken);

    const user = await googleOAuthServices.findOrCreateOAuthUser(
      googleUser.email,
      googleUser.name
    );

    const token = googleOAuthServices.generateOAuthJWT(user);

    res.json({
      message: "Google OAuth login successful",
      token,
      user,
    });
  } catch (error: any) {
    console.error(error?.response?.data || error);
    res.status(500).json({ message: "OAuth login failed" });
  }
};
