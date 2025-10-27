"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignSchema = void 0;
const zod_1 = require("zod");
exports.campaignSchema = zod_1.z.object({
    title: zod_1.z.string().min(5).max(100),
    description: zod_1.z.string().min(20),
    budget: zod_1.z.number().min(0),
    budgetVisibility: zod_1.z.enum(["public", "masked", "private"]).default("masked"),
    budgetRange: zod_1.z.string().optional(),
    platforms: zod_1.z.array(zod_1.z.enum(["instagram", "youtube", "tiktok", "twitter", "facebook"])).optional(),
    startDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date({
        required_error: "Start date is required",
        invalid_type_error: "Start date must be a valid date",
    })),
    endDate: zod_1.z.preprocess((val) => (val ? new Date(val) : undefined), zod_1.z.date({
        required_error: "End date is required",
        invalid_type_error: "End date must be a valid date",
    }).refine((date) => date instanceof Date, {
        message: "End date must be a valid date",
    })),
    status: zod_1.z.enum(["draft", "active", "completed"]).default("draft"),
    createdAt: zod_1.z.date().default(() => new Date()),
    updatedAt: zod_1.z.date().default(() => new Date()),
});
