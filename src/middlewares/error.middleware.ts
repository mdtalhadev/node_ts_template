import { log } from "console";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Log the error
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err : undefined, // Detailed error only in development
    });
};

export const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
    log(req.method,': ', req.url);

    res.status(404).json({
      success: false,
      message: process.env.NODE_ENV === "development" ? "Ohh no! You are lost, Find the correct path 😢" : "Oops! We couldn't find what you were looking for. 😢",
    });
  };