import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config({ path: "./src/config/.env.dev" });
const app = express();
const PORT = process.env.PORT || 5000;

await bootstrap(app, express);

app.listen(PORT, () => {
  console.log(
    chalk.redBright.italic.bold(`Server is running on http://localhost:${PORT}`)
  );
});
