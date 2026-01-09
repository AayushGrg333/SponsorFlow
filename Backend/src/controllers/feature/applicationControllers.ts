import ApplicationModel from "../../models/Application";
import { Request, Response, RequestHandler } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { applicationSchema } from "../../../Shared/validations/applicationSchema";
import CompanyModel, { CompanyDocument } from "../../models/Company";
import { User } from "../../models/user";
import CampaignModel from "../../models/Campaign";
//create new aplication
//  POST /api/campaigns/:campaignId/applications
export const createApplication: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as User;
          if (!user || user.usertype !== "influencer") {
               return Apiresponse.error(
                    res,
                    "Only influencers can apply to campaigns"
               );
          }
          const { campaignId } = req.params;
          if (!campaignId) {
               return Apiresponse.error(res, "Campaign ID is required");
          }
          const campaign = await CampaignModel.findById(campaignId);
          if (!campaign) {
               return Apiresponse.error(res, "Campaign not found");
          }
          const parsedData = applicationSchema.parse(req.body);

          //dublication check
          const existingApplication = await ApplicationModel.findOne({
               influencer: user._id,
               campaign: campaignId,
          });
          if (existingApplication) {
               return Apiresponse.error(res, "Application already exists");
          }

          const result = await ApplicationModel.create({
               influencer: user._id,
               campaign: campaignId,
               company: campaign.company,
               status: "pending",
               message: parsedData.message,
          });
          return Apiresponse.success(
               res,
               "Application created successfully",
               result
          );
     }
);

//  POST /api/campaigns/:campaignId/applications
export const getApplicationsByCampaign: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as CompanyDocument;
          if (!user || user.usertype !== "company") {
               return Apiresponse.error(
                    res,
                    "Only companies can view applications"
               );
          }
          const { campaignId } = req.params;
          if (!campaignId) {
               return Apiresponse.error(res, "Campaign ID is required");
          }
          const applications = await ApplicationModel.find({
               campaign: campaignId,
               company: user._id,
          })
               .populate(
                    "influencer",
                    "username displayName profileImage bio platforms experienceYears"
               )
               .populate(
                    "campaign",
                    "title budget budgetRange status startDate endDate"
               )
               .sort({ appliedAt: -1 });

          return Apiresponse.success(
               res,
               "Applications fetched successfully",
               applications
          );
     }
);

// GET /api/applications/:applicationId — Get application details (company or influencer)
export const getApplicationDetails: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as User | CompanyDocument;
          if (user.usertype !== "company" && user.usertype !== "influencer") {
               return Apiresponse.error(res, "Unauthorized access");
          }
          const { applicationId } = req.params;
          if (!applicationId) {
               return Apiresponse.error(res, "Application ID is required");
          }

          const application = await ApplicationModel.findById(applicationId)
               .populate("influencer", "-password")
               .populate(
                    "campaign",
                    "title description budget budgetRange status startDate endDate"
               )
               .populate("company", "companyName email");

          if (!application) {
               return Apiresponse.error(res, "Application not found");
          }

          if (
               user.usertype === "influencer" &&
               (!application.influencer ||
                    application.influencer._id.toString() !==
                         user.id.toString())
          ) {
               return Apiresponse.error(res, "Unauthorized access");
          }

          if (
               user.usertype === "company" &&
               (!application.company ||
                    application.company._id.toString() !== user.id.toString())
          ) {
               return Apiresponse.error(res, "Unauthorized access");
          }

          let filteredApplication: any = application.toObject();

          if (user.usertype === "company") {
               delete filteredApplication.company; // don’t expose other companies’ info
          } else if (user.usertype === "influencer") {
               delete filteredApplication.influencer; // don’t expose other influencers’ info
          }
          return Apiresponse.success(
               res,
               "Application fetched successfully",
               filteredApplication
          );
     }
);

// PATCH /api/applications/:applicationId — Update application status (accept/decline) (company only)
export const updateApplicationStatus: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as CompanyDocument;
          if (!user || user.usertype !== "company") {
               return Apiresponse.error(
                    res,
                    "Only companies can update application status"
               );
          }
          const { applicationId } = req.params;
          if (!applicationId) {
               return Apiresponse.error(res, "Application ID is required");
          }
          const { status } = req.body;
          if (!["pending", "accepted", "rejected"].includes(status)) {
               return Apiresponse.error(res, "Invalid status value");
          }
          const application = await ApplicationModel.findOneAndUpdate({
               _id: applicationId,
               company: user._id,
          });
          if (!application) {
               return Apiresponse.error(
                    res,
                    "Application not found or you do not have permission to update it",
                    404
               );
          }
          application.status = status;
          await application.save();
          return Apiresponse.success(
               res,
               "Application status updated successfully",
               application
          );
     }
);

// DELETE /api/applications/:applicationId — Withdraw/delete application (influencer or admin)
export const deleteApplication: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as User | CompanyDocument;
          const { applicationId } = req.params;
          if (!applicationId) {
               return Apiresponse.error(res, "Application ID is required");
          }
          const application = await ApplicationModel.findById(applicationId);
          if (!application) {
               return Apiresponse.error(res, "Application not found");
          }
          if (
               user.usertype === "influencer" &&
               application.influencer.toString() !== user.id.toString()
          ) {
               return Apiresponse.error(
                    res,
                    "You can only withdraw your own applications"
               );
          }
          if (
               user.usertype === "company" &&
               application.company.toString() !== user.id.toString()
          ) {
               return Apiresponse.error(
                    res,
                    "You can only delete applications for your own campaigns"
               );
          }
          await application.remove();
          return Apiresponse.success(res, "Application deleted successfully");
     }
);

// GET /api/influencers/:influencerId/applications — List influencer’s applications
export const getApplicationsByInfluencer: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as User;
          if (!user || user.usertype !== "influencer") {
               return Apiresponse.error(
                    res,
                    "Only influencers can view their applications"
               );
          }

          const applications = await ApplicationModel.find({
               influencer: user.id,
          })
               .populate(
                    "campaign",
                    "campaignName description budget startDate endDate status"
               )
               .populate("company", "companyName profileImage")
               .sort({ appliedAt: -1 }); // Most recent first

          return Apiresponse.success(
               res,
               "Applications fetched successfully",
               applications
          );
     }
);
