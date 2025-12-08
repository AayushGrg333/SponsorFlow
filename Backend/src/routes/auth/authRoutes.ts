import express from "express";
import {verifySignupCode,resendVerifyCode} from '../../controllers/auth/signupVerifyController'
import {loginController,logoutcontroller} from "../../controllers/auth/influencerAuth"
import refreshTokenController from "../../controllers/refreshTokenController";
import { rateLimiter } from "../../middlewares/ratelimiter";

const router = express.Router();

//to verify signup code
router.post(`/signup/verify/:usertype/:username`,rateLimiter,verifySignupCode)
router.post(`/signup/resend-verify/:usertype/:username`,rateLimiter,resendVerifyCode)

// to verify login auths
router.post('/login',rateLimiter,loginController);
router.post('/logout',rateLimiter,logoutcontroller);
router.post('/forgot-password',rateLimiter)

//refresh token endpoint
router.post('/refresh-token',refreshTokenController)


export default router;

