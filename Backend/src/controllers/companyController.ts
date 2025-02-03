import { RequestHandler } from "express";
import { signupSchema } from "../../../Shared/validations/signupSchema";
import randomize from "randomatic";
import bcrypt from "bcrypt";
import CompanyModel from "@/models/Company";

const companySignupController : RequestHandler = async (req, res) =>{
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
          const existingUserByUsername = await CompanyModel.findOne({
              username,
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
                  existingUserByEmail.username = username;
                  existingUserByEmail.email = email;
                  existingUserByEmail.password = hashedPassword;
                  existingUserByEmail.verifyCode = verificationCode;
                  existingUserByEmail.verifyCodeExpiry = expiryDate;
  
                  await existingUserByEmail.save();
  
                  res.status(200).json({
                      success: true,
                      message: "Signup successful. Verification code sent",
                      verificationCode,
                  });
                  return;
              }
          } else {
              //condition 2 :  Create a new user if email does not exist
                 await CompanyModel.create({
                  username,
                  email,
                  password: hashedPassword,
                  verifyCode: verificationCode,
                  verifyCodeExpiry: expiryDate,
              });
  
              res.status(200).json({
                  success: true,
                  message: "Signup successful. Verification code sent",
                  verificationCode,
              });
              return;
          }
      } catch (error) {
          console.error("Error registering Company:", error);
          res.status(500).json({
              success: false,
              message: "Failed during Company signup",
          });
          return;
      }
  };

export  default companySignupController;