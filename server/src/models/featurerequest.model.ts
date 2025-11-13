import { Schema, model, Document, Types } from "mongoose";

export interface IFeatureRequest extends Document {
  title: string;
  description: string;
  status: string;
  createdBy: Types.ObjectId;
  votes: Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
}

const featureRequestSchema = new Schema<IFeatureRequest>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["planned", "in-progress", "completed", "rejected"],
    default: "planned",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default model<IFeatureRequest>("FeatureRequest", featureRequestSchema);
