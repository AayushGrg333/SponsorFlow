import { RequestHandler, Request, Response } from "express";
import {
     companyProfileSchema,
     companyProfileUpdateSchema,
} from "../../../Shared/validations/profileCompletionSchema";
import CompanyModel from "../../models/Company";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { ObjectId } from "mongoose";

declare global {
     namespace Express {
          interface User {
               _id: string | ObjectId;
          }
     }
}

export const companyProfileSetupController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user;
          console.log(req.body);

          if (!user) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const parsedData = companyProfileSchema.safeParse(req.body);
          if (!parsedData.success) {
               const messages = parsedData.error.issues
                    .map((issue) => issue.message)
                    .join(", ");
               res.status(400).json({
                    status: "error",
                    message: messages,
               });
               return;
          }

          const company = await CompanyModel.findById(user!._id);
          if (!company) {
               return Apiresponse.error(res, "Company not found", 404);
          }

          const {
               email,
               addressType,
               address,
               contactNumber,
               contentType,
               profileImage,
               products,
               establishedYear,
               description,
               socialLinks,
          } = parsedData.data;

          company.email = email;
          company.addressType = addressType;
          if (addressType === "Physical") {
               company.address = address;
          } else {
               company.address = undefined;
          }
          company.contactNumber = contactNumber;
          company.contentType = contentType;
          if (profileImage !== undefined) {
               company.profileImage = profileImage;
          }
          company.products = products;
          company.establishedYear = establishedYear;
          if (description !== undefined) {
               company.description = description;
          }
          company.socialLinks = socialLinks;
          company.isProfileComplete = true;

          await company.save();
          const publicCompany = {
               id: company._id,
               email: company.email,
               role: "company",
               profileImage: company.profileImage,
               isProfileComplete: company.isProfileComplete,
               addressType: company.addressType,
               address: company.address,
               contactNumber: company.contactNumber,
               contentType: company.contentType,
               products: company.products,
               establishedYear: company.establishedYear,
               description: company.description,
               socialLinks: company.socialLinks,
          };

          return res.status(200).json({
               status: "success",
               message: "Company profile updated",
               company: publicCompany,
          });
     }
);

/**
 * @description Get public company profile by ID or slug
 * @route GET /api/companies/:companyId
 * @access Public
 */
export const getCompanyProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const { companyId } = req.params;
          const cacheKey = `company:${companyId}`;


          const company = await CompanyModel.findOne({
               $or: [{ _id: companyId }, { slug: companyId }],
               isverified: true,
               isprofileComplete: true,
          }).select(
               "companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug"
          );

          if (!company) {
               return Apiresponse.error(res, "Company not found", 404);
          }

          // await Redis.client.set(cacheKey,JSON.stringify(company),{EX: 3600})

          return Apiresponse.success(
               res,
               "Company profile fetched successfully",
               company
          );
     }
);

/**
 * @description List or search verified companies
 * @route GET /api/companies
 * @access Public or Authenticated
 */
export const listCompaniesController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const {
               search,
               contentType,
               page = 1,
               limit = 10,
          } = req.query as {
               search?: string;
               contentType?: string;
               page?: string;
               limit?: string;
          };

          const query: any = {
               isVerified: true,
               isProfileComplete: true,
          };

          if (search) {
               query.companyName = { $regex: search, $options: "i" };
          }

          if (contentType) {
               query.contentType = { $elemMatch: { contentType: contentType } };
          }

          const skip = (Number(page) - 1) * Number(limit);

          const companies = await CompanyModel.find(query)
               .select(
                    "companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug"
               )
               .skip(skip)
               .limit(Number(limit))
               .sort({ createdAt: -1 });

          const total = await CompanyModel.countDocuments(query);

          return res.status(200).json({
               success: true,
               total,
               currentPage: Number(page),
               totalPages: Math.ceil(total / Number(limit)),
               companies,
          });
     }
);

export const updateCompanyProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const companyId = req.params.companyId;
          const authCompanyId = (req.user as { _id?: string })?._id?.toString();
          if (!authCompanyId || authCompanyId !== companyId) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }
          const parsedData = companyProfileUpdateSchema.safeParse(req.body);

          if (!parsedData.success) {
               return res.status(400).json({
                    status: "error",
                    message: "Invalid data",
                    errors: parsedData.error.issues,
               });
          }

          const updatedCompany = await CompanyModel.findByIdAndUpdate(
               companyId,
               {
                    $set: parsedData.data,
               },
               { new: true, runValidators: true }
          );

          if (!updatedCompany) {
               return Apiresponse.error(res, "Company not found", 404);
          }

          return Apiresponse.success(res, "Company profile updated", {
               company: updatedCompany,
          });
     }
);

// /**
//  * Controller to list campaigns for a company.
//  *
//  * Access rules:
//  * - Logged in as company or influencer: full campaign details
//  * - Visitor (not logged in): limited campaign details
//  */
// export const listCompanyCampaignsController: RequestHandler = asyncWrapper(
//   async (req: Request, res: Response) => {
//     const user = req.user as { usertype?: string; companyId?: string } | undefined;
//     const companyId = req.params.companyId;

//     if (!companyId) {
//       return Apiresponse.error(res, "Company ID is required", 400);
//     }

//     // Fetch campaigns for company, sorted by newest first
//     const campaigns = await CampaignModel.find({ company: companyId }).sort({ createdAt: -1 });

//     // Define a limited view for visitors
//     const limitedCampaignView = (campaign: typeof campaigns[0]) => ({
//       _id: campaign._id,
//       title: campaign.title,
//       description: campaign.description.length > 150 ? campaign.description.slice(0, 150) + "..." : campaign.description,
//       budgetRange: campaign.budgetVisibility === "masked" ? campaign.budgetRange : undefined,
//       platforms: campaign.platforms,
//       status: campaign.status === "active" ? campaign.status : undefined,
//       startDate: campaign.startDate,
//       endDate: campaign.endDate,
//     });

//     // If user is logged in as company or influencer, send full campaigns
//     if (user && (user.usertype === "company" || user.usertype === "influencer")) {
//       // For budget, apply visibility rules
//       const fullCampaigns = campaigns.map(campaign => {
//         let budgetToShow: number | undefined;
//         if (campaign.budgetVisibility === "public") {
//           budgetToShow = campaign.budget;
//         } else if (campaign.budgetVisibility === "masked") {
//           budgetToShow = undefined; // budget hidden, range shown instead
//         } else if (campaign.budgetVisibility === "private") {
//           budgetToShow = undefined; // budget hidden entirely
//         }

//         return {
//           _id: campaign._id,
//           title: campaign.title,
//           description: campaign.description,
//           budget: budgetToShow,
//           budgetRange: campaign.budgetVisibility === "masked" ? campaign.budgetRange : undefined,
//           platforms: campaign.platforms,
//           status: campaign.status,
//           startDate: campaign.startDate,
//           endDate: campaign.endDate,
//           createdAt: campaign.createdAt,
//           updatedAt: campaign.updatedAt,
//         };
//       });

//       return Apiresponse.success(res, "Company campaigns fetched", {
//         campaigns: fullCampaigns,
//       });
//     }

//     // Visitor fallback: limited view only
//     const limitedCampaigns = campaigns.map(limitedCampaignView);

//     return Apiresponse.success(res, "Company campaigns fetched", {
//       campaigns: limitedCampaigns,
//     });
//   }
// );
