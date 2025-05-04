import express from "express";
import verifySignupCode from "Backend/src/controllers/signupVerifyController";

const router = express.Router();
router.post(`/signup/verify/:usertype/:username`,verifySignupCode)

export default router;

