import {Router} from 'express';
import Redis from '../config/redis';
import mongoose from 'mongoose';
import Apiresponse from '../utils/apiresponse';
import { asyncWrapper } from '../utils/asyncHandler';
import { Request,Response, } from 'express';


const router = Router();

/**
 * @route GET /health
 * @desc Check the health status of the application
 * @access Public
 */

router.get('/health', asyncWrapper(async (req: Request, res: Response) => {
const healthStatus: any = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: new Date(),
    services: {
      mongodb: "unknown",
      redis: "unknown",
    }
};

// Check MongoDB connection
  try {
    healthStatus.services.mongodb = mongoose.connection.readyState === 1 ? "up" : "down";
  } catch (err) {
    healthStatus.services.mongodb = "down";
  }

   // Check Redis connection
  try {
  await Redis.client?.ping();
      healthStatus.services.redis = "up";
  } catch (err) {
    healthStatus.services.redis = "down";
  }

  // Set HTTP status
  const allServicesUp = Object.values(healthStatus.services).every(status => status === "up");
  const statusCode = allServicesUp ? 200 : 503;

  return Apiresponse.success(res, "Health check", healthStatus);
}))