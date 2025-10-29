import CampaignModel from "../../models/Campaign";
import { Request, Response, RequestHandler } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { campaignSchema } from "../../../Shared/validations/campaignSchema";

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
               errors: parsedData.error.issues,
          });
     };
     const result = await CampaignModel.create({
          ...parsedData.data,
          company : user._id,
     });

     return Apiresponse.success(res, "Campaign created successfully",result);
    });

export const getCampaignController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { id } = req.params;
          const user = req.user;
          if (!user) {
                    const guestCampaign = await CampaignModel.findById(id).select(
                         "title description platforms startDate endDate status createdAt"
                    );

                    if (!guestCampaign) {
                         return Apiresponse.error(res, "Campaign not found", 404);
                    }
                    return Apiresponse.success(res, "Campaign fetched successfully", guestCampaign);

          }
          const campaign = await CampaignModel.findById(id).select(
               "company title description budget budgetRange platforms startDate endDate status createdAt"
          )
          if (!campaign) {
               return Apiresponse.error(res, "Campaign not found", 404);
          }

          return Apiresponse.success(res, "Campaign fetched successfully", campaign);

     }
)

export const listCampaignsController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user;
          if (!user) {
               const campaigns = await CampaignModel.find().select(
                    "title description platforms startDate endDate status createdAt"
               );
               return Apiresponse.success(res, "Campaigns fetched successfully", campaigns);
          }

          const campaigns = await CampaignModel.find({ company: user._id }).select(
               "title description budget budgetRange platforms startDate endDate status createdAt"
          );
          if(campaigns.length === 0) {
               return Apiresponse.error(res, "No campaigns found", 404);
          }

          return Apiresponse.success(res, "Campaigns fetched successfully", campaigns);
     }
)

export const updateCampaignController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { id } = req.params;
          const user = req.user;
          if (!user) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }
          const parsedData = campaignSchema.partial().safeParse(req.body);

          if(!parsedData.success) {
               return res.status(400).json({
                    status: "error",
                    message: "Invalid data",
                    errors: parsedData.error.issues,
               });
          }

          const campaign = await CampaignModel.findOne({ _id: id, company: user._id });
          if (!campaign) {
               return Apiresponse.error(res, "Campaign not found or you do not have permission to update it", 404);
          }
          Object.assign(campaign, parsedData.data);
          await campaign.save();
          return Apiresponse.success(res, "Campaign updated successfully", campaign);
     }
)

export const deleteCampaignController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { id } = req.params;
          const user = req.user;
          if (!user) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const campaign = await CampaignModel.findOne({ _id: id, company: user._id });
          if (!campaign) {
               return Apiresponse.error(res, "Campaign not found or you do not have permission to delete it", 404);
          }

          await campaign.remove();
          return Apiresponse.success(res, "Campaign deleted successfully");
     }
)

export const getCampaignByCompanyController: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const user = req.user;

    // Guest user
    if (!user) {
      const guestCampaigns = await CampaignModel.find({ company: companyId }).select(
        "title description platforms startDate endDate status createdAt"
      );

      if (guestCampaigns.length === 0) {
        return Apiresponse.error(res, "No campaigns found for this company", 404);
      }

      return Apiresponse.success(res, "Company campaigns fetched successfully", guestCampaigns);
    }

    // Logged-in user (full access)
    const campaigns = await CampaignModel.find({ company: companyId });

    if (campaigns.length === 0) {
      return Apiresponse.error(res, "No campaigns found for this company", 404);
    }

    return Apiresponse.success(res, "Company campaigns fetched successfully", campaigns);
  }
);
