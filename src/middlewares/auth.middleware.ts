// src/middlewares/authMiddleware.ts
import { RequestHandler, Request } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware: RequestHandler = (req: AuthenticatedRequest, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET_ACCESS!, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    req.user = decoded;
    next();
  });
};