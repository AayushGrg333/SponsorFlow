import { Request,Response } from "express";
import UserModel from "../models/User";
import bcrypt from 'bcrypt';


export const influencerSignup = async (req: Request, res: Response) => {
     try {
          const { username , email , password } = req.body();
          
     } catch (error) {
          
     }
}