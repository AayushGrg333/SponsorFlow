import express from "express";
import verifySignupCode from '../../controllers/signupVerifyController'
import loginController from "../../controllers/loginController";

const router = express.Router();

//to verify signup code
router.post(`/signup/verify/:usertype/:username`,verifySignupCode)

// to verify login auths
router.post('/login',loginController);

export default router;

