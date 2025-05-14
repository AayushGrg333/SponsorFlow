import express from "express";
import companySignupController from "../controllers/auth/companyController";
import passport from "passport";
import influencerCallbackController from "../controllers/auth/influencerCallbackController";

const router = express.Router(); 
router.post('/auth/sign-up',companySignupController);
router.get('/auth/google',passport.authenticate('influencer-google',{
          scope : ['profile','email'],
          session : false,
     }));
router.get('/oauth2/google/callback/',
     passport.authenticate ('influencer-google',{session : false}),
     influencerCallbackController
)


export default router;

