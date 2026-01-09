import { Request, Response, RequestHandler } from "express";
import { asyncWrapper } from "../../utils/asyncHandler";
import { User } from "../../models/user"
import { CompanyDocument } from "../../models/Company"; // adjust path

export const getCurrentUserController: RequestHandler = asyncWrapper(
  async (req: Request, res: Response) => {
    const user = req.user as User | CompanyDocument;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // Check if it's an influencer or company
    if (user.usertype === "influencer") {
      const influencer = user as User;
      return res.status(200).json({
        success: true,
        user: {
          id: influencer._id,
          email: influencer.email,
          role: influencer.usertype,
          isProfileComplete: influencer.isProfileComplete,
          username: influencer.username,
          displayName: influencer.displayName,
          profileImage: influencer.profileImage,
          isVerified: influencer.isVerified,
          realName: influencer.realName,
          platforms: influencer.platforms,
          contentType: influencer.contentType,
          experienceYears: influencer.experienceYears,
          socialMediaProfileLinks: influencer.socialMediaProfileLinks,
          previousSponsorships: influencer.previousSponsorships,
        }
      });
    } else {
      const company = user as CompanyDocument;
      return res.status(200).json({
        success: true,
        user: {
          id: company._id,
          email: company.email,
          role: company.usertype,
          isProfileComplete: company.isProfileComplete,
          companyName: company.companyName,
          slug: company.slug,
          profileImage: company.profileImage,
          isVerified: company.isVerified,
          addressType: company.addressType,
          address: company.address,
          contactNumber: company.contactNumber,
          contentType: company.contentType,
          products: company.products,
          establishedYear: company.establishedYear,
          description: company.description,
          socialLinks: company.socialLinks,
        }
      });
    }
  }
);