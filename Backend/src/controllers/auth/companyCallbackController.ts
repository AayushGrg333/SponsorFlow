import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import { RequestHandler, Request, Response } from "express";
import { Company } from "../../models/Company";
import { asyncWrapper } from "../../utils/asyncHandler";





const CompanyCallbackController: RequestHandler = asyncWrapper(async (req : Request, res: Response) => {
    const companyData = req.user as Company;

        if (!companyData) {
            res.status(401).json({
                success: false,
                message: "Unable to signup with Google",
            });
            return; 
        }

        const accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;

        const accessToken = jwt.sign(
            {
                id: companyData._id,
                usertype: companyData.usertype,
            },
            accessTokenSecret,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                id: companyData._id,
                usertype: companyData.usertype,
            },
            refreshTokenSecret,
            { expiresIn: "30d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully with Google",
        });
});

export default CompanyCallbackController;