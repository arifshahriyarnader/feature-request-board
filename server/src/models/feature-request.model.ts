import { Schema, model, Document, Types } from "mongoose";

export interface IFeatureRequest extends Document {
  board: Types.ObjectId;
  title: string;
  description: string;
  status: string;
  createdBy: Types.ObjectId;
  votes: Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const featureRequestSchema = new Schema<IFeatureRequest>(
  {
    board: {
      type: Schema.Types.ObjectId,
      ref: "BoardConfig",
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["planned", "in-progress", "completed", "rejected"],
      default: "planned",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default model<IFeatureRequest>(
  "FeatureRequest",
  featureRequestSchema
);
