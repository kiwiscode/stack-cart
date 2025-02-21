import * as dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const configMiddleware = (app: Application): void => {
  app.set("trust proxy", 1);
  app.use(morgan("dev"));
  app.use(helmet());

  if (process.env.NODE_ENV === "production") {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs in production
      })
    );
  }

  if (process.env.NODE_ENV === "development") {
    // More flexible limit for development (for example, 5000 instead of 1000)
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5000, // higher request limit for development
      })
    );
  }

  app.use(express.urlencoded({ extended: false }));
  app.use(
    express.json({
      limit: "50mb",
    })
  );

  // CORS MIDDLEWARE INSIDE module.exports TO ALLOW CROSS-ORIGIN INTERACTION:
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
    })
  );
};

export default configMiddleware;
