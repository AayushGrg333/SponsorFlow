import express from "express";
import {companySignupController,CompanyCallbackController} from "../controllers/auth/companyAuth"
import passport from "passport";
import { Company } from "../models/Company";
import verifyToken from "../middlewares/verifytoken";
import {companyProfileSetupController,getCompanyProfileController } from "../controllers/profile/companyProfile";


const router = express.Router(); 

//auth
router.post('/auth/sign-up',companySignupController);
router.get('/auth/google',passport.authenticate('company-google',{
          scope : ['profile','email'],
          session : false,
     }));
     
router.get('/oauth2/google/callback',(req,res,next) => {
     passport.authenticate("company-google",
          (err : any , company : Company , info : any)=> {
               if(err || !company){
                    console.error("google signin failed",err)
                    return res.status(401).json({
                         success : false,
                         message : "Error signing up with google"
                    })
               }
               req.user = { ...company.toObject?.() ?? company, role: "company" };
               return CompanyCallbackController(req,res,next);
          }
     )(req,res,next)
})

//profile
router.post('/profile',verifyToken,companyProfileSetupController);
router.get('/profile/:companyId',verifyToken, getCompanyProfileController);


export default router;

