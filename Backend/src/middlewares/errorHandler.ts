import winston from "winston";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError";

const logger = winston.createLogger({
     level: "error",
     format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
     ),
     transports: [
          new winston.transports.File({
               filename: "error.log",
               level: "error",
          }),
          new winston.transports.Console({
               format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
               ),
          }),
     ],
});

export const errorHandler : ErrorRequestHandler = (
      err,
      req,
      res,
      next
)=>{
  // Log the error details
  logger.error({
    message: err.message,
    stack: err.stack,
    path : req.path,
    method : req.method,
    ip : req.ip,
    timestamp: new Date().toISOString(),
  });

  // Handle known application errors
    if (err instanceof AppError) {
     res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      timestamp: err.timestamp,
      path: req.path
    });
    return;
  }

  if( err.name === "ValidationError") {
     res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }
  //handle mongoose jwt error
    if (err.name === 'JsonWebTokenError') {
     res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
    return;
  }

  //handle mongoose duplicate key error
    if ((err as any).code === 11000) {
   res.status(409).json({
      status: 'error',
      message: 'Duplicate field value entered'
    });
    return;
  }
//handle other errors
 res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
  return;
}

//404 handler
export const notfoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
}
