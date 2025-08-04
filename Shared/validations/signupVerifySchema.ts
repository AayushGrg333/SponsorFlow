import {z} from "zod";

export const verifySchema = z.object({
     username : z.string().min(3),
     usertype : z.enum(["influencer","company"]),
     verificationCode : z.string().length(6),
});

export const resendVerifySchema = z.object({
     username : z.string().min(3),
     usertype : z.enum(["influencer","company"]),
});
