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
     console.log("Inside verifyToken middleware");
     let token = req.cookies.accessToken;

     if (!token) { 
          const authHeader = req.headers.authorization;
          if(authHeader && authHeader.startsWith("Bearer ")) {
               token  = authHeader.split(" ")[1];
          }
     } 

     if (!token) {
          res.status(401).json({
               success: false,
               message: "Access denied, No token found.",
          });
          return;
     }

     try {
          console.log("Verifying token:", token);
          console.log("existsing secrets:", process.env.JWT_ACCESS_SECRET);
          const decodedPayload = jwt.verify(
               token,
               process.env.JWT_ACCESS_SECRET!
          ) as JwtPayload;

          let userFromDb;

          if (decodedPayload.usertype === "company") {
               userFromDb = await CompanyModel.findById(decodedPayload.id).select("-password");
          } else {
               userFromDb = await UserModel.findById(decodedPayload.id).select("-password");
          }

          if (!userFromDb) {
               res.status(401).json({
                    success: false,
                    message: "User not found in the database",
               });
               return;
          }

          req.user = userFromDb;

          next();
     } catch (error) {
          res.status(401).json({
               success: false,
               message: "Error during verifying Token",
          });
          return;
     }
};

export default verifyToken;
