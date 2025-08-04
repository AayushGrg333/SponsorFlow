import { RequestHandler,Request,Response } from "express";
import { companyProfileSchema } from "@/Shared/validations/profileCompletionSchema";
import CompanyModel from "../../models/Company";
import { asyncWrapper } from "../../utils/asyncHandler";

export const companyProfileSetupController : RequestHandler = asyncWrapper(
async (req: Request,res: Response)=>{
          const user = req.user
          console.log(user)
          if(!user){
               res.status(401).json({error: "Unauthorized"})
          }

          return res.status(200).json({
               success: true,
               message: "Company profile setup controller hit",
               user: user
          })
          // const parsedData =  companyProfileSchema.safeParse(req.body)
          // if(!parsedData.success){
          //      res.status(401).json({
          //           success : false,
          //           message : "Wrong Profile data input",
          //           Error : parsedData.error.errors
          //      })
          //      return;
          // }

})

