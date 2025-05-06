import dotenv from "dotenv"
dotenv.config();

import { RequestHandler } from "express";
import passport from "passport";
import { loginSchema } from "../../../Shared/validations/loginSchema";
import jwt from 'jsonwebtoken'
import { User } from "../models/User";

const loginController: RequestHandler = async (req, res, next) => {
    try {
        const parsedData = loginSchema.safeParse({
            identifier: req.body.identifier,
            password: req.body.password,
            usertype: req.body.usertype,
        });

        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: "invalid login data",
                error: parsedData.error.errors,
            });
            return;
        }
        const  { usertype } = parsedData.data
        const Strategy =
            parsedData.data.usertype === "company" ? "company-local" : "influencer-local";

        passport.authenticate(
            Strategy,
            (err: any, user: User | false, info: any) => {
                if (err) return next(err);

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: info?.message || "User Authentication failed",
                    });
                }

                const secret = process.env.JWT_SECRET!
                const token = jwt.sign({
                    id: user._id,
                    usertype
                },secret,{expiresIn : "1d"});

                res.cookie("token",token,{
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                })

                return res.status(200).json({
                    success : true,
                    message : "login successful",
                    user,
               })
            }
        )(req,res,next);
    } catch (error) {
        next(error)
    }
};

export default loginController;
