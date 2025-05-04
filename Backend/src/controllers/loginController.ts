import { RequestHandler } from "express";
import passport from "passport";
import { CompanyLoginSchema,influencerLoginSchema } from "@shared/validations/loginSchema";

const loginController : RequestHandler  = async (req,res,next) =>{
     try {
          const {identifier , password, usertype} = req.body
          res.status(200).json({
               success : true,
               message: "login successful"
          })



     } catch (error) {
          
     }
}

 export default loginController;