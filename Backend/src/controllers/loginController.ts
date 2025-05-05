import { RequestHandler } from "express";
import passport from "passport";
import { CompanyLoginSchema,influencerLoginSchema,companyNameSchema } from "../../../Shared/validations/loginSchema";
import { z } from "zod";

const CompanyloginController : RequestHandler  = async (req,res,next) =>{
     try {

          const checkEmail = z.string().email({ message: "Invalid email format" })

          const isEmail = (email : string)=>{
               return checkEmail.safeParse(email).success;
          }

          let parsedData;

          isEmail(req.body.identifier)
          if(!isEmail) {
                parsedData = CompanyLoginSchema.safeParse({
                    identifier : companyNameSchema,
                    password : req.body.password,
                    usertype : req.body.usertype
               })
          }else{
               const emailSchema = z.object({
                    email: checkEmail
               })
                parsedData = CompanyLoginSchema.safeParse({
                    identifier : emailSchema,
                    password : req.body.password,
                    usertype : req.body.usertype
               })
          }

          if(!parsedData.success){
               res.status(400).json({
                    success : false,
                    message: "invalid login data",
                    error : parsedData.error.errors
               })
               return;
          }

          const {identifier , password, usertype} = parsedData.data
          console.log(identifier,password,usertype)

          res.status(200).json({
               success : true,
               message: "login successful"
          })



     } catch (error) {
          
     }
}

 export default CompanyloginController;