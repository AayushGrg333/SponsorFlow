import dotenv from "dotenv";
dotenv.config();
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const refreshTokenController: RequestHandler = (req, res) => {
     const token = req.cookies.refreshToken;
          if (!token) {
          res.status(401).json({ message: "refresh token not found" });
          return; 
     }

     const accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
     const refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
     jwt.verify(token, refreshTokenSecret, (err: any, decoded: any) => {
          if (err)
               return res
                    .status(403)
                    .json({ message: "Invalid refresh token" });

               

          const { id, usertype } = decoded;

          const newAccessToken = jwt.sign({ id, usertype }, accessTokenSecret, {
               expiresIn: "15m",
          });

          res.cookie("accessToken", newAccessToken, {
               httpOnly: true,
               sameSite: "lax",
               secure: false,
               maxAge: 15 * 60 * 1000,
          });

          res.json({
               success: true,
               message: "new access token has been assigned",
          });
     });
};

export default refreshTokenController;
