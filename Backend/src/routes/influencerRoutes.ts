import express from "express";
import influencerSignupController from "../controllers/auth/influencerController";
import passport from 'passport'
import influencerCallbackController from "../controllers/auth/influencerCallbackController";

const router = express.Router(); 
router.post('/auth/sign-up',influencerSignupController);

router.get('/auth/google',passport.authenticate('influencer-google',{
          scope : ['profile','email'],
          session : false,
     }));

router.get('/oauth2/google/callback/',
     passport.authenticate ('influencer-google',{session : false}),
     influencerCallbackController
)


router.use(passport.authenticate("jwt", { session: false }));

export default router;

