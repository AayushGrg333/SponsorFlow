"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerifySchema = exports.verifySchema = void 0;
var zod_1 = require("zod");
exports.verifySchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    usertype: zod_1.z.enum(["influencer", "company"]),
    verificationCode: zod_1.z.string().length(6),
});
exports.resendVerifySchema = zod_1.z.object({
    username: zod_1.z.string().min(3),
    usertype: zod_1.z.enum(["influencer", "company"]),
});
