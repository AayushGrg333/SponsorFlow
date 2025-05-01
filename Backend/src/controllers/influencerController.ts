
import { RequestHandler } from "express";
import UserModel from "../models/User";
import { signupSchema } from "../../../Shared/validations/signupSchema";
import randomize from "randomatic";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../utils/sendVerificationEmail";

const influencerSignupController: RequestHandler = async (req, res) => {
    try {
        // Validate input data using Zod
        const parsedData = signupSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({
                success: false,
                message: "Invalid signup data",
                errors: parsedData.error.errors,
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
            res.status(400).json({
                success: false,
                message: "Username already exists",
            });
            return;
        }

        const existingUserByEmail = await UserModel.findOne({ email });

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
                existingUserByEmail.username = username;
                existingUserByEmail.email = email;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = expiryDate;

                await existingUserByEmail.save();

            await sendVerificationEmail(username,email, verificationCode,"influencer");

                res.status(200).json({
                    success: true,
                    message: "Signup successful. Verification code sent",
                    verificationCode,
                });
                return;
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

            await sendVerificationEmail(username,email, verificationCode,"influencer");

            res.status(200).json({
                success: true,
                message: "Signup successful. Verification code sent",
            });


            return;
        }
    } catch (error) {
        console.error("Error registering influencer:", error);
        res.status(500).json({
            success: false,
            message: "Failed during influencer signup",
        });
        return;
    }
};

export default influencerSignupController;
