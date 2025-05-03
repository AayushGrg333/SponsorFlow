import {RequestHandler} from "express";
import UserModel from "../models/User";
import CompanyModel from "../models/Company";

const verifySignupCode : RequestHandler = async (req,res) =>{
     try {
          const { usertype , username } = req.params;
          const { verificationCode } = req.body;
          if(!verificationCode){
               res.status(400).json(
                    {
                         success: false,
                         message: "Verification Code is required",
                    }
               )
          }
          

          const existingByUsername = usertype === "influencer"
          ? await UserModel.findOne({ username : username}) 
          : await CompanyModel.findOne({ username : username});

          if(! existingByUsername){
               res.status(400).json(
                    {
                         success: false,
                         message: "User does not exists",
                    }
               ) 
          }

          if (existingByUsername.verifyCode === verificationCode){
               if(new Date(existingByUsername.verifyCodeExpiry) > new Date){
                    res.status(400).json(
                         {
                              success: false,
                              message: "Verification code has been expired signup again to generate new code",
                         }
                    ) 
               }else{
                    res.status(200).json(
                         {
                              success: true,
                              message: "User verification successful",
                         }
                    )
               }
          }else{
               res.status(400).json(
                    {
                         success: false,
                         message: "Verification code is incorrect",
                    }
               ) 
          }
 

     } catch (error) {
          
     }
}

export default verifySignupCode;