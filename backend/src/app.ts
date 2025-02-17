import express from "express";
import configMiddleware from "./config";
import authRouter from "./routes/auth.routes";

export function createApp() {
  const app = express();
  configMiddleware(app);

  app.use("/api/auth", authRouter);

  return app;
}
