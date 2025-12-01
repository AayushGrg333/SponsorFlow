import Redis from "../config/redis";
import { Request,Response,NextFunction } from "express";
import Apiresponse from "../utils/apiresponse";
import { asyncWrapper } from "../utils/asyncHandler";


export const rateLimiter = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
     const userId = req.ip;
     const key = `rate:${userId}`;

     // increment in count 
     const count = await Redis.client.incr(key)
     if(count === 1){
          await Redis.client.expire(key,60); // set expiry of 60 seconds
     }
     if(count > 10){
          return Apiresponse.error(res, "Too many requests, please try again later", 429);
     }else{
          next();
     }
})