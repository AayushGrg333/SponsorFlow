import { RequestHandler, Request, Response } from "express";
import { companySignupSchema } from "../../../Shared/validations/signupSchema";
import randomize from "randomatic";
import bcrypt from "bcrypt";
import CompanyModel from "../../models/Company";
import sendVerificationEmail from "../../utils/sendVerificationEmail";
import { asyncWrapper } from "../../utils/asyncHandler";
import { CompanyDocument } from "../../models/Company";
import Jwt from "jsonwebtoken";
import { config } from "../../config/config";

export const companySignupController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const parsedData = companySignupSchema.safeParse(req.body);
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

          const { companyName, email, password } = parsedData.data;
          // Check if username already exists and is verified

          const existingUserByUsername = await CompanyModel.findOne({
               companyName,
               isVerified: true,
          });

          if (existingUserByUsername) {
               res.status(400).json({
                    success: false,
                    message: "Company name already exists",
               });
               return;
          }

          const existingUserByEmail = await CompanyModel.findOne({ email });

          const verificationCode = randomize("0", 6);
          const hashedPassword = await bcrypt.hash(password, 10);
          const expiryDate = new Date(Date.now() + 600000);

          if (existingUserByEmail) {
               if (existingUserByEmail.isVerified) {
                    res.status(400).json({
                         success: false,
                         message: "Email already exists",
                    });
                    return;
               } else {
                    //condition 1:  If email exists but is NOT verified, update the previous entry
                    existingUserByEmail.companyName = companyName;
                    existingUserByEmail.email = email;
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verificationCode;
                    existingUserByEmail.verifyCodeExpiry = expiryDate;

                    if (!existingUserByEmail.slug) {
                         existingUserByEmail.slug = companyName
                              .toLowerCase()
                              .replace(/\s+/g, "-");
                    }

                    const slug = companyName.toLowerCase().replace(/\s+/g, "-");
                    await existingUserByEmail.save();

                    await sendVerificationEmail(
                         slug,
                         email,
                         verificationCode,
                         "company"
                    );
                    res.status(200).json({
                         success: true,
                         message: "Signup successful. Verification code sent",
                         slug: existingUserByEmail.slug,
                         verificationCode,
                    });
                    return;
               }
          } else {
               //condition 2 :  Create a new user if email does not exist
               const slug = companyName.toLowerCase().replace(/\s+/g, "-");

               await CompanyModel.create({
                    companyName,
                    email,
                    password: hashedPassword,
                    verifyCode: verificationCode,
                    verifyCodeExpiry: expiryDate,
                    slug,
               });
               await sendVerificationEmail(
                    slug,
                    email,
                    verificationCode,
                    "company"
               );

               res.status(200).json({
                    success: true,
                    message: "Signup successful. Verification code sent",
                    slug,
                    verificationCode,
               });
               return;
          }
     }
);

export const CompanyCallbackController: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const googleUser = req.user as CompanyDocument;

          if (!googleUser) {
               return res.status(401).json({
                    success: false,
                    message: "Google authentication failed",
               });
          }

          // 🔍 Check if company already exists
          const existingCompany = await CompanyModel.findOne({
               googleId: googleUser.googleId,
          });

          if (existingCompany) {
               const usertype = "company";

               const accessToken = Jwt.sign(
                    { id: existingCompany._id, usertype },
                    config.JWT_ACCESS_SECRET,
                    { expiresIn: "1h" }
               );

               const refreshToken = Jwt.sign(
                    { id: existingCompany._id, usertype },
                    config.JWT_REFRESH_SECRET,
                    { expiresIn: "30d" }
               );

               res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 60 * 60 * 1000,
               });

               res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 30 * 24 * 60 * 60 * 1000,
               });

               // ✅ Always redirect to callback page first
               const redirectUrl = `https://sponsorflow-eta.vercel.app/auth/callback?token=${accessToken}`;
               return res.redirect(redirectUrl);
          }
     }
);
