import { Response } from "express";

export const handleServerError = (
  res: Response,
  error: unknown,
  message = "Server error"
) => {
  console.error(error); // Log the error (optional, but useful for debugging)
  res.status(500).json({
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined, // Show error details in development only
  });
};
export const sendSuccessResponse = (
  res: Response,
  message: string,
  data: any = null,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  errors: any = null,
  statusCode: number = 400
) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
  return;
};
