import { RequestHandler, Request, Response } from "express";
import {
     companyProfileSchema,
} from "../../../Shared/validations/profileCompletionSchema";
import CompanyModel, { Company } from "../../models/Company";
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
          const { id } = req.params;
     


          const company = await CompanyModel.findOne({
               $or: [{ _id: id }, { slug: id }],
               isVerified: true,
               isProfileComplete: true,
          }).select(
               "companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug"
          );

          if (!company) {
               return Apiresponse.error(res, "Company not found", 404);
          }


          return Apiresponse.success(
               res,
               "Company profile fetched successfully",
               company
          );
     }
);

/**
 * @description Get own company profile (no verification required)
 * @route GET /api/company/profile/me
 * @access Private (Company only)
 */
export const getMyCompanyProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as Company;
          
          if (!user || user.usertype !== "company") {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const company = await CompanyModel.findById(user._id).select(
               "companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug isVerified isProfileComplete"
          );

          if (!company) {
               return Apiresponse.error(res, "Company not found", 404);
          }

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
/**
 * @description Update company profile
 * @route PUT /api/company/profile/:companyId
 * @access Private (Company only)
 */
export const updateCompanyProfileController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as Company;
          const { companyId } = req.params;
          
          if (!user || user.usertype !== "company") {
               return Apiresponse.error(res, "Only companies can update profiles");
          }
          
          if (user._id.toString() !== companyId) {
               return Apiresponse.error(res, "You can only update your own profile");
          }
          
          const {
               companyName,
               description,
               addressType,
               address,
               contactNumber,
               contentType,
               products,
               establishedYear,
               socialLinks,
          } = req.body;
          
          const updateData: any = {};
          
          if (companyName) updateData.companyName = companyName;
          if (description) updateData.description = description;
          if (addressType) updateData.addressType = addressType;
          if (address) updateData.address = address;
          if (contactNumber) updateData.contactNumber = contactNumber;
          if (contentType) updateData.contentType = contentType;
          if (products) updateData.products = products;
          if (establishedYear) updateData.establishedYear = establishedYear;
          if (socialLinks) updateData.socialLinks = socialLinks;
          
          const company = await CompanyModel.findByIdAndUpdate(
               companyId,
               updateData,
               { new: true, runValidators: true }
          ).select(
               "companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug"
          );
          
          if (!company) {
               return Apiresponse.error(res, "Company not found", 404);
          }
          
          return Apiresponse.success(res, "Profile updated successfully", company);
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
