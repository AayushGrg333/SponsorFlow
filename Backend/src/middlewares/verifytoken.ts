import dotenv from "dotenv";
dotenv.config();

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";
import CompanyModel from "../models/Company";

export interface JwtPayload {
     id: string;
     usertype: string;
}

const verifyToken: RequestHandler = async (req, res, next) => {
     const token = req.cookies.accessToken;
     if (!token) {
          res.status(401).json({
               success: false,
               message: "Access denied, No token found.",
          });
          return;
     }

     try {
          const decodedPayload = jwt.verify(
               token,
               process.env.JWT_ACCESS_SECRET!
          ) as JwtPayload;

          if ((decodedPayload.usertype = "compnay")) {
               const userFromDb = await CompanyModel.findById(
                    decodedPayload.id
               ).select("-password");
               if (!userFromDb) {
                    res.status(401).json({
                         success: false,
                         message: "User not found in the database",
                    });
               }
               req.user = userFromDb;
          }else{
                const userFromDb = await UserModel.findById(
                    decodedPayload.id
               ).select("-password");
               if (!userFromDb) {
                    res.status(401).json({
                         success: false,
                         message: "User not found in the database",
                    });
               }
               req.user = userFromDb;
          }

          next();
     } catch (error) {
          res.status(401).json({
               success: false,
               message: "Error during verifying Token",
          });
     }
};

export default verifyToken;
