import express from "express";
import {influencerSignupController,influencerCallbackController} from "../controllers/auth/influencerAuth";
import passport from "passport";
import { User } from "../models/User";
import verifyToken from "../middlewares/verifytoken";
const router = express.Router();

router.post("/auth/sign-up", influencerSignupController);
router.get(
    "/auth/google",
    passport.authenticate("influencer-google", {
        scope: ["profile", "email"],
        session: false,
    })
);

router.get("/oauth2/google/callback", (req, res, next) => {
    passport.authenticate(
        "influencer-google",
        { session: false },
        (err: any, user: User, info: any) => {
            if (err || !user) {
                console.error("login failed", err || info);
                return res.status(400).json({
                    success: false,
                    message: "Unable to signup with Google",
                });
            }

            req.user = user as User//manually attacted the user
            next(); 
            return influencerCallbackController(req, res, next);
        }
    )(req, res, next);
});

export default router;
