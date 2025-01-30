import { Request,Response } from "express";
import UserModel from "../models/User";
import {signupSchema} from "../../../Shared/validations/signupSchema"
import randomize from 'randomatic';
import bcrypt from 'bcrypt';

export const influencerSignup = async (req: Request, res: Response) => {
     try {
          const parsedData = signupSchema.safeParse(req.body);
          if (!parsedData.success){
               return res.status(400).json({
                    success : false,
                    message : "Invalied signup data",
                    error : parsedData.error.errors
               })
          }

          const { username , email , password } = parsedData.data;
          
          if(!username || !email || !password){
               return res.status(400).json({
                    success: false,
                    message : "Signup data is incomplete",
                    error : "Missing required field",
               })
          }

          //check if the username exists
          const existingUserByUsername = await UserModel.findOne({
               username,
               isVerified : true
          })

          if(existingUserByUsername){
               return res.status(400).json({
                    success : false,
                    message : "Username already exists",
                    error : "Username already exists"
               })
          }

          const existingUserByEmail = await UserModel.findOne({email : email})
          const verificationCode = randomize('0', 6);
          if(existingUserByEmail){
               if(existingUserByEmail.isVerified){
                    return res.status(400).json({
                         success : false,
                         message : "Email already exists",
                    })
               }else {
                    existingUserByEmail.username = username;
                    existingUserByEmail.email = email;
                    existingUserByEmail.password = await bcrypt.hash(password,10);
                    existingUserByEmail.verifyCode = verificationCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)
                    
                    await existingUserByEmail.save();

                    return res.status(200).json({
                         success : true,
                         message : "Signup Successfull. Verification code sent",
                         verificationCode,
                    })
               }
          }

     } catch (error) {
          
     }
}