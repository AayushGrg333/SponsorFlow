"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.influencerProfileSchema = exports.companyProfileUpdateSchema = exports.companyProfileSchema = exports.PlatformStatsSchema = exports.SocialPlatformSchema = void 0;
var zod_1 = require("zod");
var libphonenumber_js_1 = require("libphonenumber-js");
var contentSchema = zod_1.z.object({
    content: zod_1.z.string(),
});
exports.SocialPlatformSchema = zod_1.z.enum([
    "website",
    "instagram",
    "linkedin",
    "twitter",
    "youtube",
    "facebook"
]);
var socialLinkSchema = zod_1.z.object({
    type: zod_1.z.enum([
        "website",
        "instagram",
        "linkedin",
        "twitter",
        "youtube",
        "facebook",
    ]),
    url: zod_1.z.string(),
});
exports.PlatformStatsSchema = zod_1.z.object({
    platform: exports.SocialPlatformSchema,
    count: zod_1.z.number().min(0, "Follower count cannot be negative"),
});
exports.companyProfileSchema = zod_1.z
    .object({
    email: zod_1.z.string().email({ message: "Invalid email format" }),
    addressType: zod_1.z.enum(["Online", "Physical"]),
    address: zod_1.z.string().optional(),
    contactNumber: zod_1.z
        .string()
        .refine(function (val) {
        var _a;
        var phoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(val);
        return (_a = phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.isValid()) !== null && _a !== void 0 ? _a : false;
    }, {
        message: "Invalid phone number. Use international format like +123456789",
    })
        .transform(function (val) {
        var phoneNumber = (0, libphonenumber_js_1.parsePhoneNumberFromString)(val);
        return (phoneNumber === null || phoneNumber === void 0 ? void 0 : phoneNumber.number) || val;
    }),
    contentType: zod_1.z.array(contentSchema),
    profileImage: zod_1.z.string().optional(), // or .nullable().optional()
    products: zod_1.z.array(zod_1.z.string()), // safer syntax
    establishedYear: zod_1.z.number(),
    description: zod_1.z.string().optional(),
    socialLinks: zod_1.z.array(socialLinkSchema),
})
    .refine(function (data) {
    if (data.addressType === "Physical") {
        return !!data.address;
    }
    return true;
}, {
    message: "Address is required when address type is Physical",
    path: ["address"],
});
exports.companyProfileUpdateSchema = exports.companyProfileSchema._def.schema.partial();
exports.influencerProfileSchema = zod_1.z.object({
    realName: zod_1.z.object({
        givenName: zod_1.z.string().min(1, "Given name is required"),
        middleName: zod_1.z.string().optional(),
        familyName: zod_1.z.string().min(1, "Family name is required"),
    }),
    displayName: zod_1.z.string().min(3, "display name is required"),
    bio: zod_1.z.string().optional(),
    socialMediaProfileLinks: zod_1.z.array(socialLinkSchema),
    experienceYears: zod_1.z.number().min(0, "Experience years cannot be negative"),
    previousSponsorships: zod_1.z.array(zod_1.z.string()).optional(),
    contentType: zod_1.z.array(contentSchema).min(1, "At least one content type is required"),
    profileImage: zod_1.z.string().optional(),
    platforms: zod_1.z.array(exports.PlatformStatsSchema).min(1, "At least one platform is required"),
});
