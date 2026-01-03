import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

export interface AuthPayload extends DefaultJwtPayload {
  _id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
