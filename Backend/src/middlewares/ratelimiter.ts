import { Request, Response, NextFunction } from "express";
import Apiresponse from "../utils/apiresponse";

const rateLimitStore: Record<string, { count: number; expiresAt: number }> = {};

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const userId = req.ip as string;// identify user by IP
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  if (!rateLimitStore[userId] || now > rateLimitStore[userId].expiresAt) {
    // reset counter
    rateLimitStore[userId] = {
      count: 1,
      expiresAt: now + windowMs,
    };
  } else {
    // increment
    rateLimitStore[userId].count++;
  }

  if (rateLimitStore[userId].count > 10) {
     Apiresponse.error(res, "Too many requests. Please try again later.");
  }

  next();
}
