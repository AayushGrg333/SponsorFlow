import express from "express";
import verifySignupCode from '../../controllers/signupVerifyController'
import loginController from "../../controllers/loginController";
import logoutcontroller from "../../controllers/logoutcontroller";
import refreshTokenController from "../../controllers/refreshTokenController";

const router = express.Router();

//to verify signup code
router.post(`/signup/verify/:usertype/:username`,verifySignupCode)

// to verify login auths
router.post('/login',loginController);
router.post('/logout',logoutcontroller);

//refresh token endpoint
router.post('/refresh-token',refreshTokenController)


export default router;

