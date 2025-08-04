import express from "express";
import {verifySignupCode,resendVerifyCode} from '../../controllers/auth/signupVerifyController'
import {loginController,logoutcontroller} from "../../controllers/auth/influencerAuth"
import refreshTokenController from "../../controllers/refreshTokenController";

const router = express.Router();

//to verify signup code
router.post(`/signup/verify/:usertype/:username`,verifySignupCode)
router.post(`/signup/resend-verify/:usertype/:username`,resendVerifyCode)

// to verify login auths
router.post('/login',loginController);
router.post('/logout',logoutcontroller);
router.post('/forgot-password', )

//refresh token endpoint
router.post('/refresh-token',refreshTokenController)


export default router;

