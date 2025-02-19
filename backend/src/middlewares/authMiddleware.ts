import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    console.log("Unauthorized");
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
    if (err) {
      console.log("error:", err);
      if (err.name === "TokenExpiredError") {
        console.error("Token has expired");
        return res.status(401).json({ message: "Token has expired" });
      }
      console.log("Invalid token");
      return res.status(403).json({ message: "Invalid token" });
    }

    req.body.userId = decoded.userId;
    next();
  });
};
