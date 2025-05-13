import {RequestHandler} from "express"
import passport from "passport"

const googleAuthController : RequestHandler = (req,res)=>{
     passport.authenticate(google)
}