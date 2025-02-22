import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("Unauthorized");
    res.status(401).json({ errorMessage: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
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

    req.body.userId = decoded.userId;
    next();
  });
};
