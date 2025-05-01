import {RequestHandler} from "express";
import UserModel from "../models/User";
import CompanyModel from "../models/Company";

const verifySignupCode : RequestHandler = async (req,res) =>{
     try {
          const username = req.params["username"];
          const {verificationCode} = req.body;
          res.status(200).json(
               {
                    success: true,
                    message: "you are verifed",
                    data : verificationCode
               }
          )
     } catch (error) {
          
     }
}

export default verifySignupCode;