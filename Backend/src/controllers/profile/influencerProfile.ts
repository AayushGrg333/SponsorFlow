import { RequestHandler, Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { influencerProfileSchema } from "../../../Shared/validations/profileCompletionSchema";
import UserModel, { User } from "../../models/user";
import ApplicationModel from "../../models/Application";
import CampaignModel from "../../models/Campaign";

export const influencerProfileSetupController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user;
          if (!user) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const parsedData = influencerProfileSchema.safeParse(req.body);
          if (!parsedData.success) {
               res.status(400).json({
                    status: "error",
                    message: parsedData.error.issues,
                    
               });
               return;
          }
          const influencer = await UserModel.findById(user!._id);
          if (!influencer) {
               return Apiresponse.error(res, "Influencer not found", 404);
          }

          const {
               realName,
               displayName,
               socialMediaProfileLinks,
               experienceYears,
               previousSponsorships,
               contentType,
               profileImage,
               platforms,
               bio,
          } = parsedData.data;

          influencer.realName = realName;
          influencer.bio = bio;
          influencer.socialMediaProfileLinks = socialMediaProfileLinks;
          influencer.experienceYears = experienceYears;
          influencer.previousSponsorships = previousSponsorships;
          influencer.contentType = contentType;
          influencer.profileImage = profileImage;
          influencer.platforms = platforms;
          influencer.displayName = displayName;
          influencer.isProfileComplete = true;
          await influencer.save();
const publicUser = {
  id: influencer._id,
  email: influencer.email,
  role: influencer.userType,
  displayName: influencer.displayName,
  profileImage: influencer.profileImage,
  isProfileComplete: influencer.isProfileComplete,
  bio: influencer.bio,
  socialMediaProfileLinks: influencer.socialMediaProfileLinks, // links
  platforms: influencer.platforms,                               // platforms
  contentType: influencer.contentType,                          // optional, if UI uses it
  experienceYears: influencer.experienceYears,                  // optional, if UI uses it
  previousSponsorships: influencer.previousSponsorships,        // optional
};


          return Apiresponse.success(
               res,
               "Influencer profile updated successfully",
               publicUser
          );
     }
);

export const getInfluencerProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { influencerId } = req.params;


          const influencer = await UserModel.findOne({
               $or: [{ _id: influencerId }, { slug: influencerId }],
               isVerified: true,
               isProfileComplete: true,
          }).select("-password -__v -email -createdAt -updatedAt");

          if (!influencer) {
               return Apiresponse.error(res, "Influencer not found", 404);
          }

          // await Redis.client.set(influencerKey, JSON.stringify(influencer), { EX: 3600 });

          return Apiresponse.success(
               res,
               "Influencer profile fetched successfully",
               influencer
          );
     }
);

export const getMyInfluencerProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as User;
          if (!user) {
               return Apiresponse.error(res, "Unauthorized", 401);    
          }

          const influencer = await UserModel.findById(user._id).select(
               "-password -createdAt -updatedAt"
          );
          if (!influencer) {
               return Apiresponse.error(res, "Influencer not found", 404);
          }

          return Apiresponse.success(
               res,
               "Influencer profile fetched successfully",
               influencer
          );
     }
)

export const updateInfluencerProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as User;
          const { influencerId } = req.params;
          
          if( !user || user.usertype !== 'influencer') {
               return Apiresponse.error(res, "Only influencers can update profiles");
          }

          if (!user || user._id.toString() !== influencerId) {
               return Apiresponse.error(res, "you can update your own profile",);
          }

          const {
               username,
               displayName,
               bio,
               email,
               password,
               socialMediaProfileLinks,
               experienceYears,
               previousSponsorships,
               contentType,
               realName,
               platforms
          } = req.body;

          const updatedata : any = {};

          if(username) updatedata.username = username;
          if(displayName) updatedata.displayName = displayName;
          if(bio) updatedata.bio = bio;
          if(email) updatedata.email = email;
          if(password) updatedata.password = password;
          if(socialMediaProfileLinks) updatedata.socialMediaProfileLinks = socialMediaProfileLinks;
          if(experienceYears) updatedata.experienceYears = experienceYears;
          if(previousSponsorships) updatedata.previousSponsorships = previousSponsorships;
          if(contentType) updatedata.contentType = contentType;
          if(realName) updatedata.realName = realName;
          if(platforms) updatedata.platforms = platforms;

          const influencer = await UserModel.findByIdAndUpdate(
               influencerId,
               { $set: updatedata },
               { new: true }
          ).select("-password -createdAt -updatedAt");

          if (!influencer) return Apiresponse.error(res, "Influencer not found", 404);

          return Apiresponse.success(
               res,
               "Influencer profile updated successfully",
               influencer
          );
     }
);

export const listInfluencersController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { search, contentType, page = 1, limit = 10 } = req.query;
          const query: any = {
               isVerified: true,
               isProfileComplete: true,
          };
          if (search) {
               query.displayName = { $regex: search, $options: "i" };
          }

          if (contentType) {
               query.contentType = { $elemMatch: { contentType: contentType } };
          }

          const skip = (Number(page) - 1) * Number(limit);
          const influencers = await UserModel.find(query)
               .select("-password -__v -email -createdAt -updatedAt")
               .skip(skip)
               .limit(Number(limit))
               .sort({ createdAt: -1 });

          const total = await UserModel.countDocuments(query);

          return res.status(200).json({
               succsess: true,
               influencers,
               total,
               currentPage: Number(page),
               totalPages: Math.ceil(total / Number(limit)),
          });
     }
);

export const listInfluencerCampaignsController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { influencerId } = req.params;
          if (!influencerId) {
               return Apiresponse.error(res, "Influencer ID is required", 400);
          }

          const applications = await ApplicationModel.find({
               influencer: influencerId,
          })
               .populate({
                    path: "campaign",
                    model: CampaignModel,
                    select: "title budget budgetVisibility status startDate endDate company", // Select only needed fields
               })
               .sort({ createdAt: -1 });

          const formatted = applications.map((app) => ({
               campaign: app.campaign,
               status: app.status,
               appliedAt: app.createdAt,
          }));

          return res.status(200).json({
               status: "success",
               count: formatted.length,
               campaigns: formatted,
          });
     }
);
