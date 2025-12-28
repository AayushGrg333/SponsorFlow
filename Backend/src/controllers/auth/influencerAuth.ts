import { Request, Response, NextFunction, RequestHandler } from "express";
import passport from "passport";
import { loginSchema } from "../../../Shared/validations/loginSchema";
import jwt from "jsonwebtoken";
import UserModel, { User } from "../../models/user";
import { Company } from "../../models/Company";
import { config } from "../../config/config";
import { asyncWrapper } from "../../utils/asyncHandler";
import { signupSchema } from "../../../Shared/validations/signupSchema";
import Apiresponse from "../../utils/apiresponse";
import randomize from "randomatic";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../../utils/sendVerificationEmail";
import { log } from "../../middlewares/errorHandler";

type SafeInfluencer = {
     id: string;
     email: string;
     role: "influencer";
     isProfileComplete: boolean;
     displayName: string;
     profileImage: string;
     bio?: any;
     socialMediaProfileLinks: any[];
     platforms: any[];
     contentType: any[];
     experienceYears: number;
     previousSponsorships: any[];
};

type SafeCompany = {
     id: string;
     email: string;
     role: "company";
     isProfileComplete: boolean;
     companyName: string;
     profileImage: string;
     description: string;
     socialLinks: any[];
     contentType: any[];
     establishedYear: number;
     address: string;
     contactNumber: string;
};

type SafeUser = SafeInfluencer | SafeCompany;

export const influencerSignupController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          // Validate input data using Zod
          const parsedData = signupSchema.safeParse(req.body);
          if (!parsedData.success) {
               const message = parsedData.error.issues
                    .map((issue) => issue.message)
                    .join(", ");
               res.status(400).json({
                    success: false,
                    message: message,
                    errors: parsedData.error.issues,
               });
               return;
          }

          const { username, email, password } = parsedData.data;
          // Check if username already exists and is verified
          const existingUserByUsername = await UserModel.findOne({
               username,
               isVerified: true,
          });

          if (existingUserByUsername) {
               return Apiresponse.error(res, "username already exists", 400);
          }

          const existingUserByEmail = await UserModel.findOne({ email });

          const verificationCode = randomize("0", 6);
          const hashedPassword = await bcrypt.hash(password, 10);
          const expiryDate = new Date(Date.now() + 600000);

          if (existingUserByEmail) {
               if (existingUserByEmail.isVerified) {
                    return Apiresponse.error(res, "Email already exists", 400);
               } else {
                    //condition 1:  If email exists but is NOT verified, update the previous entry
                    existingUserByEmail.username = username;
                    existingUserByEmail.email = email;
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verificationCode;
                    existingUserByEmail.verifyCodeExpiry = expiryDate;

                    await existingUserByEmail.save();

                    await sendVerificationEmail(
                         username,
                         email,
                         verificationCode,
                         "influencer"
                    );

                    return Apiresponse.success(
                         res,
                         "Signup successful. Verification code sent"
                    );
               }
          } else {
               //condition 2 :  Create a new user if email does not exist
               await UserModel.create({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode: verificationCode,
                    verifyCodeExpiry: expiryDate,
               });

               await sendVerificationEmail(
                    username,
                    email,
                    verificationCode,
                    "influencer"
               );

               return Apiresponse.success(
                    res,
                    "Signup successful. Verification code sent"
               );
          }
     }
);

export const influencerCallbackController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const influencer = req.user as User;

          if (!influencer) {
               return res.status(401).json({
                    success: false,
                    message: "Unable to login with Google",
               });
          }

          const accessToken = jwt.sign(
               {
                    id: influencer._id, // ✅ FIXED
                    usertype: influencer.usertype,
               },
               process.env.JWT_ACCESS_SECRET!,
               { expiresIn: "15m" }
          );

          const refreshToken = jwt.sign(
               {
                    id: influencer._id,
                    usertype: influencer.usertype,
               },
               process.env.JWT_REFRESH_SECRET!,
               { expiresIn: "30d" }
          );

          const isProd = false;

          res.cookie("accessToken", accessToken, {
               httpOnly: true,
               secure: isProd,
               sameSite: isProd ? "none" : "lax",
               maxAge: 15 * 60 * 1000,
          });

          res.cookie("refreshToken", refreshToken, {
               httpOnly: true,
               secure: isProd,
               sameSite: isProd ? "none" : "lax",
               maxAge: 30 * 24 * 60 * 60 * 1000,
          });

          // ✅ Decide redirect destination
     const redirectUrl = `http://localhost:3000/auth/callback`;
          return res.redirect(redirectUrl);
     }
);

export const loginController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response, next: NextFunction) => {
          const parsedData = loginSchema.safeParse({
               identifier: req.body.identifier,
               password: req.body.password,
               usertype: req.body.usertype,
          });

          if (!parsedData.success) {
               const message = parsedData.error.issues
                    .map((issue) => issue.message)
                    .join(", ");
               res.status(400).json({
                    success: false,
                    message: message,
                    errors: parsedData.error.issues,
               });
               return;
          }

          const { usertype } = parsedData.data;
          const Strategy =
               parsedData.data.usertype === "company"
                    ? "company-local"
                    : "influencer-local";
          passport.authenticate(
               Strategy,
               (err: any, user: User | Company | false, info: any) => {
                    if (err) return next(err);

                    if (!user) {
                         log.info("Login failed", {
                              error: info.message || "Invalid credentials",
                         });
                         return Apiresponse.error(
                              res,
                              "Invalid credentials",
                              401
                         );
                    }

                    const accessTokenSecret = config.JWT_ACCESS_SECRET;
                    const refreshTokenSecret = config.JWT_REFRESH_SECRET;

                    const accessToken = jwt.sign(
                         {
                              id: user._id,
                              usertype,
                         },
                         accessTokenSecret,
                         { expiresIn: "15m" }
                    );

                    const refreshToken = jwt.sign(
                         {
                              id: user._id,
                              usertype,
                         },
                         refreshTokenSecret,
                         { expiresIn: "30d" }
                    );

                    res.cookie("refreshToken", refreshToken, {
                         httpOnly: true,
                         sameSite: "strict",
                         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    });

                    res.cookie("accessToken", accessToken, {
                         httpOnly: true,
                         sameSite: "strict",
                         secure: false,
                         maxAge: 15 * 60 * 1000, // 15 min
                    });

                    let safeUser: SafeUser;

                    if (usertype === "influencer") {
                         const influencer = user as User;
                         safeUser = {
                              id: influencer.id,
                              email: influencer.email,
                              role: "influencer",
                              isProfileComplete: influencer.isProfileComplete,
                              displayName: influencer.displayName,
                              profileImage: influencer.profileImage,
                              bio: influencer.realName,
                              socialMediaProfileLinks:
                                   influencer.socialMediaProfileLinks,
                              platforms: influencer.platforms,
                              contentType: influencer.contentType,
                              experienceYears: influencer.experienceYears,
                              previousSponsorships:
                                   influencer.previousSponsorships,
                         };
                    } else {
                         const company = user as Company;
                         safeUser = {
                              id: company._id.toString(),
                              email: company.email,
                              role: "company",
                              isProfileComplete: company.isProfileComplete,
                              companyName: company.companyName,
                              profileImage: company.profileImage,
                              description: company.description,
                              socialLinks: company.socialLinks,
                              contentType: company.contentType,
                              establishedYear: company.establishedYear,
                              address: company.address,
                              contactNumber: company.contactNumber,
                         };
                    }

                    return res.status(200).json({
                         success: true,
                         message: "login successful",
                         accessToken,
                         user: safeUser,
                    });
               }
          )(req, res, next);
     }
);

export const logoutcontroller: RequestHandler = (req, res) => {
     res.clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
     });
     res.clearCookie("accessToken", {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
     });
     res.status(200).json({
          success: true,
          message: "logged out successfully",
     });
};
