import express, { Application } from "express";
import bodyParser from "body-parser";
import { appConfig } from "./config";
import connectDB from "./db";
import apiRoutes from "./routes/api";

const app: Application = express();
app.use(bodyParser.json());
app.use(express.json());

connectDB();

app.use("/api", apiRoutes)

app.listen(appConfig.PORT, () => {
  console.log(`Server is running on port ${appConfig.PORT}`);
});
