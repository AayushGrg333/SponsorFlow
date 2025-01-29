import {z} from "zod";

export const usernameValidation = z
     .string()
     .min(3,"Username must be atlest 3 characters")
     .max(15,"Username must be no more than 15 characters")
     .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special characters");

export const passwordValidation = z
     .string()
     .min(8," Password must containt atleast 8 charaters")
     .regex(/[0-9]/,"Password must contain at least one number")
     .regex(/[\W_]/,"Password must contain at lease one special character")

export const signupSchema = z.object({
     username : usernameValidation,
     email : z.string().email({message : "invalid format"}),
     password : passwordValidation,
})