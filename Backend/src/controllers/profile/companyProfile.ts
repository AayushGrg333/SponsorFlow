import { RequestHandler, Request, Response } from "express";
import { companyProfileSchema } from "@/Shared/validations/profileCompletionSchema";
import CompanyModel from "../../models/Company";
import { asyncWrapper } from "../../utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import { ObjectId } from "mongoose";

declare global {
     namespace Express {
          interface Company {
               _id: string | ObjectId;
          }
     }
}

export const companyProfileSetupController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const user = req.user as { companyId?: string };
          if (!user || !user.companyId) {
               return Apiresponse.error(res, "Unauthorized", 401);
          }

          const parsedData = companyProfileSchema.safeParse(req.body);
          if (!parsedData.success) {
               res.status(400).json({
                    status: "error",
                    message: "Invalid data",
                    errors: parsedData.error.errors,
               });
               return;
          }

          const company = await CompanyModel.findById(user.companyId);
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

          await company.save();

          return res.status(200).json({
               status: "success",
               message: "Company profile updated",
               company,
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
          const {companyId} = req.params;
          const company = await CompanyModel.findOne({
            $or : [{_id: companyId},{slug: companyId}],
            isverified: true,
            isprofileComplete: true
          })
          .select(
      "companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug"
     );

          if (!company) {
               return Apiresponse.error(res, "Company not found", 404);
          }

          return res.status(200).json({
               status: "success",
               company,
          });
     }
);


/**
 * @description List or search verified companies
 * @route GET /api/companies
 * @access Public or Authenticated
 */
export const listCompaniesController: RequestHandler = asyncWrapper(
	async (req: Request, res: Response) => {
		const {search, contentType, page = 1, limit = 10} = req.query as {
			search? : string;
			contentType?: string;
			page?: string;
			limit?: string;
		}

		const query : any = {}

		if(search){
			query.companyName = { $regex: search, $options: "i"}
		}

		if(contentType){
			query.contentType = {$elemMatch : {contentType: contentType}}
		}

		const skip = (Number(page) - 1) * Number(limit);

		const companies = await CompanyModel.find(query)
		  	.select(
				"companyName email addressType address contactNumber contentType profileImage products establishedYear description socialLinks slug"
			)
			.skip(skip)
			.limit(Number(limit))
			.sort({createdAt: -1});

		const total = await CompanyModel.countDocuments(query);

		return res.status(200).json({
			success : true,
			total,
			currentPage: Number(page),
			totalPages: Math.ceil(total / Number(limit)),
			companies,
		})
		
	})


