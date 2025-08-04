import { RequestHandler, Request, Response } from "express";
import UserModel from "../../models/User";
import CompanyModel from "../../models/Company";
import { verifySchema,resendVerifySchema } from "@/Shared/validations/signupVerifySchema";
import { asyncWrapper } from "@/Backend/src/utils/asyncHandler";
import Apiresponse from "../../utils/apiresponse";
import randomize from "randomatic";
import sendVerificationEmail from "../../utils/sendVerificationEmail";

export const verifySignupCode: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          // Validate the request parameters and body against the schema
          const parsedData = verifySchema.safeParse({
               username: req.params.username,
               usertype: req.params.usertype,
               verificationCode: req.body.verificationCode,
          });

          if (!parsedData.success) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid request data",
                    errors: parsedData.error.errors,
               });
          }

          const { username, usertype, verificationCode } = parsedData.data;

          const existingByUsername =
               usertype === "influencer"
                    ? await UserModel.findOne({ username: username })
                    : await CompanyModel.findOne({ slug: username });

          if (!existingByUsername) {
               return Apiresponse.error(res, "User not found", 404);
          }

          if (existingByUsername.verifyCode === verificationCode) {
               if (new Date(existingByUsername.verifyCodeExpiry) < new Date()) {
                    return Apiresponse.error(
                         res,
                         "Verification code has expired",
                         400
                    );
                    return;
               } else {
                    existingByUsername.isVerified = true;
                    await existingByUsername.save();
                    return Apiresponse.success(
                         res,
                         "User verification successful",
                         200
                    );
               }
          } else {
               return Apiresponse.error(
                    res,
                    "Verification code is incorrect",
                    400
               );
          }
     }
);

/**
 * @description Resends a new verification code to the user (company or influencer) via email.
 * 
 * @route POST /signup/resend/:usertype/:username
 * @access Public
 * 
 * @param {Request} req - Express request object containing usertype and username in params
 * @param {Response} res - Express response object
 * 
 * @returns {Promise<Response>} 200 - Code sent, or 400/404 with error message
 */
export const resendVerifyCode: RequestHandler = asyncWrapper(
     async (req: Request, res: Response) => {
          const parsedData = resendVerifySchema.safeParse({
               username: req.params.username,
               usertype: req.params.usertype,
          });

          if (!parsedData.success) {
               return res.status(400).json({
                    success: false,
                    message: "Invalid request data",
                    errors: parsedData.error.errors,
               });
          }

          const { username, usertype } = parsedData.data;

          const user = usertype === "influencer"
               ? await UserModel.findOne({ username })
               : await CompanyModel.findOne({ slug: username });

          if (!user) {
               return Apiresponse.error(res, "User not found", 404);
          }

          const newcode = randomize("0", 6);
          const expiryDate = new Date(Date.now() + 15 * 60 * 1000); //15 min

          user.verifyCode = newcode;
          user.verifyCodeExpiry = expiryDate;
          await user.save();

          await sendVerificationEmail(username,user.email,newcode,usertype);
          return Apiresponse.success(res, "Verification code resent", 200);
     }
);
