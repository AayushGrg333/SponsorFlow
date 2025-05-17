import express from "express";
import companySignupController from "../controllers/auth/companyController";
import passport from "passport";
import { User } from "../models/User";

const router = express.Router(); 
router.post('/auth/sign-up',companySignupController);
router.get('/auth/google',passport.authenticate('influencer-google',{
          scope : ['profile','email'],
          session : false,
     }));
     
router.get('/oauth2/google/callback',(req,res,next) => {
}
)


export default router;

