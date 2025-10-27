"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companySignupSchema = exports.signupSchema = exports.passwordValidation = exports.companyNameValidation = exports.usernameValidation = void 0;
const zod_1 = require("zod");
// Username validation (No spaces)
exports.usernameValidation = zod_1.z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(15, "Username must be no more than 15 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters or spaces");
// Company name validation (Allows spaces)
exports.companyNameValidation = zod_1.z
    .string()
    .min(3, "Company name must be at least 3 characters")
    .max(50, "Company name must be no more than 50 characters")
    .regex(/^[a-zA-Z0-9 ]+$/, "Company name can only contain letters, numbers, and spaces");
// Password validation
exports.passwordValidation = zod_1.z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character");
// Signup Schema for Users
exports.signupSchema = zod_1.z.object({
    username: exports.usernameValidation,
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: exports.passwordValidation,
});
// Signup Schema for Companies
exports.companySignupSchema = zod_1.z.object({
    companyName: exports.companyNameValidation,
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    password: exports.passwordValidation,
});
