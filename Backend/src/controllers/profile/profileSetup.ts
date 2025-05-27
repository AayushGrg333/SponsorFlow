import { RequestHandler } from "express";
import { companyProfileSchema } from "@/Shared/validations/profileCompletionSchema";
import CompanyModel from "../../models/Company";

const profileSetup : RequestHandler = async (req,res)=>{
          const user = req.user
          console.log(user)
          if(!user){
               res.status(401).json({error: "Unauthorized"})
          }
     try {
          const parsedData =  companyProfileSchema.safeParse(req.body)
          if(!parsedData.success){
               res.status(401).json({
                    success : false,
                    message : "Wrong Profile data input",
                    Error : parsedData.error.errors
               })
               return;
          }
     } catch (error) {
          
     }
}

export default profileSetup