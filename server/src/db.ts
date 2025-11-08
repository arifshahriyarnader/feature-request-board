import mongoose from "mongoose";
import { appConfig } from "./config";

const uri = appConfig.DB.MONGODB_URI as string;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB is connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("Unknown error connecting to MongoDB", error);
    }
  }
};

export default connectDB;
