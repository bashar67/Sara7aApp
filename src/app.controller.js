import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Message/message.controller.js";
import connectDB from "./DB/connection.js";
import { globalErrorHandler } from "./Utils/errorHandler.utils.js";
import cors from "cors";
import path from "node:path";
import { attachRouterWithLogger } from "./Utils/Logger/logger.utils.js";
import helmet from "helmet";
import { corsOption } from "./Utils/Cors/cors.util.js";
import { rateLimit } from "express-rate-limit";

const bootstrap = async (app, express) => {
  app.use(express.json());
  app.use(cors(corsOption())); // with social media frontend, we need to enable cors for cross-origin requests
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 35, // limit each IP to 10 requests per windowMs
      message: {
        status: 429,
        message: "Too many requests, please try again later.",
      },
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
  );
  await connectDB();

  attachRouterWithLogger(app, "/api/v1/auth", authRouter, "auth.log");
  attachRouterWithLogger(app, "/api/v1/user", userRouter, "user.log");
  attachRouterWithLogger(app, "/api/v1/message", messageRouter, "message.log");

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to the API" });
  });

  app.use("/uploads", express.static(path.resolve("./src/uploads")));
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/message", messageRouter);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({ message: "Not found handler" });
  });

  app.use(globalErrorHandler);
};

export default bootstrap;
