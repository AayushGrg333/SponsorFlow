import dotenv from "dotenv";
dotenv.config();
import { RequestHandler } from "express";
import passport from "passport";
import { User } from "../../models/User";
import jwt from 'jsonwebtoken'

const influencerCallbackController: RequestHandler = (req, res, next) => {
    try {
        const influencerData = req.user as User;
        if(!influencerData){
            res.status(401).json({
                success : false,
                message : "unable to signup with google "
            })
        }
        console.log("influencerDataa : ",influencerData)
                const accessTokenSecret = process.env.JWT_ACCESS_SECRET!;
                const refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;

                const accessToken = jwt.sign(
                    {
                        id: influencerData.googleId,
                        usertype : influencerData.usertype,
                    },
                    accessTokenSecret,
                    { expiresIn: "15m" }
                );

                const refreshToken = jwt.sign(
                    {
                        id: influencerData._id,
                        usertype : influencerData.usertype,
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

                 res.status(200).json({
                    success : true,
                    message  : "logged in successfully with google",
                })
            }
    catch (error) {
         res.status(500).json({
                        success: false,
                        message: "Error found in influencer callback controller",
                    });
    }
};

export default influencerCallbackController;
