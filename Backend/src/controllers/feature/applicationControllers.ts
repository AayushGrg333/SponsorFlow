import ApplicationModel from "../../models/Application";
import { Request, Response, RequestHandler } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { applicationSchema } from "@/Shared/validations/applicationSchema";
import CompanyModel from "../../models/Company";
import { User } from "../../models/User";
import CampaignModel from "../../models/Campaign";
//create new aplication
export const createApplication: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user  =  req.user as User
          if (!user || user.usertype !== "influencer") {
               return Apiresponse.error(res, "Only influencers can apply to campaigns");
          }
          const { campaignId }  = req.params;
          if(!campaignId){
               return Apiresponse.error(res, "Campaign ID is required");
          }
          const campaign  = await CampaignModel.findById(campaignId);
          if(!campaign){
               return Apiresponse.error(res, "Campaign not found");
          }
          const company = campaign.company;
          const parsedData = applicationSchema.parse(req.body);

          //dublication check
          const existingApplication = await ApplicationModel.findOne({
               influencer: user._id,
               campaign: campaignId,
          });
          if (existingApplication) {
               return Apiresponse.error(res, "Application already exists");
          }
          
          const result  = await ApplicationModel.create({
               influencer: user._id,
               campaign: campaignId,
               company : company.id,
               status : "pending",
               message : parsedData.message,
          })
          return Apiresponse.success(res,"Application created successfully", result);
     }
)