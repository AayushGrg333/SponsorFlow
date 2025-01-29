import { Request,Response } from "express";
import UserModel from "../models/User";
import bcrypt from 'bcrypt';


export const influencerSignup = async (req: Request, res: Response) => {
     try {
          const { username , email , password } = req.body;
          
          if(!username || !email || !password){
               return res.status(400).json({
                    success: false,
                    message : "Signup data is incomplete",
                    error : "Missing required field",
               })
          }

          //check if the username exists
          const existingUser = await UserModel.findOne({username},)


     } catch (error) {
          
     }
}