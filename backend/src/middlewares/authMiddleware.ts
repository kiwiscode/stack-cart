import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader: string | undefined = req.headers.authorization;
  const token: string | undefined = authHeader?.split(" ")[1];

  if (!token) {
    console.log("Unauthorized");
    res.status(401).json({ errorMessage: "Unauthorized" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (
      err: null | jwt.VerifyErrors,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (err) {
        console.log("error:", err);
        if (err.name === "TokenExpiredError") {
          console.error("Token has expired");
          res.status(401).json({ errorMessage: "Token has expired" });
          return;
        }
        console.log("Invalid token", err);
        res.status(403).json({ errorMessage: "Invalid token" });
        return;
      }

      if (typeof decoded !== "string" && decoded && decoded.userId) {
        req.body.userId = decoded.userId;
      } else {
        res.status(403).json({ errorMessage: "Invalid token" });
        return;
      }

      next();
    }
  );
};
