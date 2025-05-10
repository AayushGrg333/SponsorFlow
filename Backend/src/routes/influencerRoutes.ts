import express from "express";
import  influencerSignupController  from "../controllers/influencerController";
import passport from 'passport'

const router = express.Router(); 
router.post('/auth/sign-up',influencerSignupController);

router.use(passport.authenticate("jwt", { session: false }));

export default router;

