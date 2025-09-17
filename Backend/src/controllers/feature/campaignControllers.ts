import CampaignModel from "../../models/Campaign";
import { Request, Response, RequestHandler } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { campaignSchema } from "@/Shared/validations/campaignSchema";

export const createCampaignController: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
     const user = req.user;
     if (!user) {
          return Apiresponse.error(res, "Unauthorized", 401);
     };

     const parsedData = campaignSchema.safeParse(req.body);
     if (!parsedData.success) {
          return res.status(400).json({
               status: "error",
               message: "Invalid data",
               errors: parsedData.error.errors,
          });
     };
     const result = await CampaignModel.create({
          ...parsedData.data,
          company : user._id,
     });

     return Apiresponse.success(res, "Campaign created successfully",result);
    });