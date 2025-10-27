"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
const signupSchema_1 = require("./signupSchema");
exports.loginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(3).max(50),
    password: signupSchema_1.passwordValidation,
    usertype: zod_1.z.enum(["influencer", "company"])
});
