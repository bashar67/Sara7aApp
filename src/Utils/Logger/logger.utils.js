import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";

const __dirname = path.resolve();

// Create a write stream (in append mode)
export const attachRouterWithLogger = (
  app,
  routerPath,
  router,
  logFileName
) => {
  const logStream = fs.createWriteStream(
    path.join(__dirname, "./src/logs", logFileName),
    { flags: "a" } // append mode
  );

  app.use(routerPath, morgan("combined", { stream: logStream }), router);

  app.use(routerPath, morgan("dev"));
  app.use(routerPath, router);
};
