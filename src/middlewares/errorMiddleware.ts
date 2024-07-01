import { NextFunction, Request, Response } from "express";
import { ApiError } from "../helpers/api-errors";
import { TokenExpiredError } from "jsonwebtoken"; // Import TokenExpiredError if not already imported

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode ?? 500;
  let message = error.message;

  if (error instanceof TokenExpiredError) {
    statusCode = 401; // Unauthorized status code for expired tokens
    message = "Token expired"; // Your custom message for token expiration
  }

  return res.status(statusCode).json({ error: message });
};
