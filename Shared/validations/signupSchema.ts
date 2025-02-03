import { z } from "zod";

// Username validation (No spaces)
export const usernameValidation = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(15, "Username must be no more than 15 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters or spaces");

// Company name validation (Allows spaces)
export const companyNameValidation = z
  .string()
  .min(3, "Company name must be at least 3 characters")
  .max(50, "Company name must be no more than 50 characters")
  .regex(/^[a-zA-Z0-9 ]+$/, "Company name can only contain letters, numbers, and spaces");

// Password validation
export const passwordValidation = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character");

// Signup Schema for Users
export const signupSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email format" }),
  password: passwordValidation,
});

// Signup Schema for Companies
export const companySignupSchema = z.object({
  companyName: companyNameValidation,
  email: z.string().email({ message: "Invalid email format" }),
  password: passwordValidation,
});
