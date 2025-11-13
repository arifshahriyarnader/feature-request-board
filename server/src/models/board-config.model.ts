import { Schema, Types, model, Document } from "mongoose";

export interface IBoardConfig extends Document {
  title: string;
  description: string;
  logo?: string;
  statuses: string[];
  defaultSort: string;
  createdAt: Date;
  updatedAt: Date;
}

const boardConfigSchema = new Schema<IBoardConfig>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String },
    statuses: {
      type: [String],
      default: ["planned", "in-progress", "completed", "rejected"],
    },
    defaultSort: {
      type: String,
      enum: ["votes", "comments", "new", "alphabatical", "random"],
      default: "votes",
    },
  },
  { timestamps: true }
);

export default model<IBoardConfig>("BoardConfig", boardConfigSchema);
