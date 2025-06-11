import { Response,Request, NextFunction } from "express";
import asyncHandler  from "express-async-handler";


export const asyncWrapper = (fn: Function) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  });
}; 