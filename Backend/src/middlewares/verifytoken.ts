import dotenv from "dotenv";
dotenv.config();

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import redisclient from "../config/redisClient";
import UserModel from "../models/User";
import CompanyModel from "../models/Company";

export interface JwtPayload {
     id: string;
     usertype: string;
}

const verifyToken: RequestHandler = async (req, res, next) => {
     const token = req.cookies.accesstoken;

     if (!token) {
          res.status(401).json({
               success: false,
               message: "Access denied, No token found.",
          });
     }

     try {
          const decodedToken = jwt.verify(
               token,
               process.env.JWT_ACCESS_SECRET!
          ) as JwtPayload;

          let user: any = await redisclient.get(`user:${decodedToken.id}`);

          if (!user) {
               if (decodedToken.usertype === "company") {
                    const userFromDb = await CompanyModel.findById(
                         decodedToken.id
                    ).select("-password");
                    if (!userFromDb) {
                          res.status(401).json({
                              success: false,
                              message: "Company user not found",
                         });
                    }
                    user = userFromDb;
               } else {
                    const userFromDb = await UserModel.findById(
                         decodedToken.id
                    ).select("-password");
                    if (!userFromDb) {
                          res.status(401).json({
                              success: false,
                              message: "Influencer user not found",
                         });
                    }
                    user = userFromDb;
               }

               // Cache user
               await redisclient.set(
                    `user:${decodedToken.id}`,
                    JSON.stringify(user),
                    {
                         EX: 60 * 60, // 1 hour
                    }
               );
          } else {
               user = JSON.parse(user);
          }

          // Attach to request
          req.user = user;
          next();
     } catch (error) {
          res.status(401).json({
               success: false,
               message: "Error during verifying Token",
          });
     }
};

export default verifyToken;
