import { Schema, Types, model, Document } from "mongoose";

export interface IOAuthUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  provider: string; 
  role: string;
  createdAt: Date;
}

const oauthUserSchema = new Schema<IOAuthUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    provider: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IOAuthUser>("OAuthUser", oauthUserSchema);