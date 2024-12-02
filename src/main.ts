import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import CONFIG from "./config";
import dotenv from "dotenv";
import userAgent from "express-useragent";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app: Express = express();

var corsWhitelist = [CONFIG.FRONTEND_DOMAIN];
var corsOptions = {
  credentials: true,
  origin: function (
    origin: any,
    callback: (arg0: Error | null, arg1: boolean | undefined) => void
  ) {
    if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(userAgent.express());
app.use(morgan("tiny"));
// app.use(cookieParser());
app.use(express.json());
// app.use(errorHandler);
dotenv.config();

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

app.get("/", (req, res) => {
  res.send("⚡️");
});

export default app;
