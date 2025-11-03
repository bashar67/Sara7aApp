import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import messageRouter from "./Modules/Message/message.controller.js";
import connectDB from "./DB/connection.js";
import { globalErrorHandler } from "./Utils/errorHandler.utils.js";

const bootstrap = async (app, express) => {
  app.use(express.json());

  await connectDB();

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to the API" });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/message", messageRouter);

  app.all("/*dummy", (req, res) => {
    return res.status(404).json({ message: "Not found handler" });
  });

  app.use(globalErrorHandler);
};

export default bootstrap;
