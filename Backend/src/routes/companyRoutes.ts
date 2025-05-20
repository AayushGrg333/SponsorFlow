import express from "express";
import companySignupController from "../controllers/auth/companyController";
import passport from "passport";
import { Company } from "../models/Company";
import CompanyCallbackController from "../controllers/auth/companyCallbackController";

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
               req.user = company as Company;
               next()
               return CompanyCallbackController(req,res,next);
          }
     )(req,res,next)
})

//profile
router.post('/profile',)


export default router;

