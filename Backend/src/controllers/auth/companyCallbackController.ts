import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import passport from "passport";
import CompanyModel from "../../models/Company";
import { Company } from "../../models/Company";

const CompanyCallbackController: RequestHandler = (req, res, next) => {
    try {
        passport.authenticate(
            "company-google",
            (error: any, user: Company, info: any) => {
                if (error) return next(error);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: "User not found",
                    });
                }

                const accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
                const refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;

                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        usertype: user.usertype,
                    },
                    accessTokenSecret,
                    { expiresIn: "15m" }
                );

                const refreshToken = jwt.sign(
                    {
                        id: user._id,
                        usertype: user.usertype,
                    },
                    refreshTokenSecret,
                    { expiresIn: "30d" }
                );
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 day
                });

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 min
                });

                return res.status(200).json({
                    success: true,
                    message: "logged in successfully with google",
                });
            }
        )(req, res, next);
    } catch (error) {}
};
