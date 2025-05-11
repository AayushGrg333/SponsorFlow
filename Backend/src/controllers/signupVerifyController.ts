import {RequestHandler} from "express";
import UserModel from "../models/User";
import CompanyModel from "../models/Company";
import { verifySchema } from "@/Shared/validations/signupVerifySchema";

const verifySignupCode : RequestHandler = async (req,res) =>{
     try {


          const parsedData = verifySchema.safeParse({
               username : req.params.username,
               usertype : req.params.usertype,
               verificationCode : req.body.verificationCode
          })

          if(!parsedData.success){
               res.status(400).json({
                    success : false,
                    message: "invalid verification data",
               })
               return;
          }

          const {username , usertype, verificationCode} = parsedData.data;

          const existingByUsername = usertype === "influencer"
          ? await UserModel.findOne({ username : username}) 
          : await CompanyModel.findOne({ slug : username});

          if(! existingByUsername){
               res.status(400).json(
                    {
                         success: false,
                         message: "User does not exists",
                    }
               ) 
               return;
          }

          if (existingByUsername.verifyCode === verificationCode){
               if(new Date(existingByUsername.verifyCodeExpiry) < new Date()){
                    res.status(400).json(
                         {
                              success: false,
                              message: "Verification code has been expired signup again to generate new code",
                         }
                    ) 
                    return;
               }else{
                    existingByUsername.isVerified = true;
                    await existingByUsername.save()
                    res.status(200).json(
                         {
                              success: true,
                              message: "User verification successful",
                         }
                    )
                    return;
               }
          }else{
               res.status(400).json(
                    {
                         success: false,
                         message: "Verification code is incorrect",
                    }
               ) 
               return;
          }
 

     } catch (error) {
          console.error("Error occured while verifying code",error);
          res.status(500).json(
               {
                    success: false,
                    message: "couldn't verify code",
               }
          ) 
          return;
     }
}

export default verifySignupCode;