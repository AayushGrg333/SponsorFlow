
import { RequestHandler, Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import {influencerProfileSchema} from "@/Shared/validations/profileCompletionSchema"
import UserModel from "../../models/User";

export const influencerProfileSetupController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user;
          if( !user) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const parsedData = influencerProfileSchema.safeParse(req.body);
          if (!parsedData.success) {
               res.status(400).json({
                    status: "error",
                    message: "Invalid data",
                    errors: parsedData.error.errors,
               });
               return;
          }
          const influencer = await UserModel.findById(user!._id);
          if (!influencer) {
               return Apiresponse.error(res, "Influencer not found", 404);
          }
          
          const {
               realName,displayName, socialMediaProfileLinks, experienceYears, previousSponsorships,
               contentType, profileImage, platforms, bio
          } = parsedData.data;

          influencer.realName = realName;
          influencer.bio = bio;
          influencer.socialMediaProfileLinks = socialMediaProfileLinks;
          influencer.experienceYears = experienceYears;
          influencer.previousSponsorships = previousSponsorships;
          influencer.contentType = contentType;
          influencer.profileImage = profileImage;
          influencer.platforms = platforms;
          influencer.displayName = displayName
          influencer.isProfileComplete = true;
          await influencer.save();

          return Apiresponse.success(res, "Influencer profile updated successfully", influencer);

     }
);

export const getCompanyProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { influencerId }  = req.params;
          const influencer = await UserModel.findOne ({
               $or : [{_id : influencerId},{slug: influencerId}],
               isVerified: true, isProfileComplete: true,
          })
          .select("-password -__v -email -createdAt -updatedAt");

          if (!influencer) {
               return Apiresponse.error(res, "Influencer not found", 404);
          }

          return Apiresponse.success(res, "Influencer profile fetched successfully", influencer);

         
     }
);

export const updateCompnayProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const influencerId = req.params.influencerId;
          const authCompanyId = req.user?._id.toString();
          if (!authCompanyId || authCompanyId !== influencerId) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const parsedData = influencerProfileSchema.safeParse(req.body);
          if (!parsedData.success) {
               res.status(400).json({
                    status: "error",
                    message: "Invalid data",      
                    errors: parsedData.error.errors,
               });
               return;
          }

          const influencer = await UserModel.findByIdAndUpdate(
               influencerId,
               {
                    $set : parsedData.data
               },
               { new: true, runValidators: true }
          );

          if (!influencer) {
               return Apiresponse.error(res, "Influencer not found", 404);
          }

          return Apiresponse.success(res, "Influencer profile updated successfully", influencer);
     }
)

export const listInfluencersController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const {search, contentType ,page = 1, limit = 10} = req.query;
          const query: any = {
               isVerified: true,
               isProfileComplete: true,
          }
          if(search){
               query.displayName = { $regex : search , $options: "i"}
          }

          if(contentType){
              query.contentType = {$elemMatch : {contentType : contentType}}
          }

          const skip = (Number(page) - 1) * Number(limit);
          const companies = await UserModel.find(query)
               .select("-password -__v -email -createdAt -updatedAt")
               .skip(skip)
               .limit(Number(limit))
               .sort({createdAt: -1});

          const total = await UserModel.countDocuments(query);

          return res.status(200).json({
               succsess: true,
               companies,
               total,
              currentPage: Number(page),
              totalPages : Math.ceil(total / Number(limit))
          })
     })