import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { platform } from "os";
const contentSchema = z.object({
     content: z.string(),
});



export const SocialPlatformSchema = z.enum([
     "website",
     "instagram",
     "linkedin",
     "twitter",
     "youtube",
     "facebook"
]);

const socialLinkSchema = z.object({
     platform: SocialPlatformSchema,
     link : z.string().min(1, "Link is required")
});

export const PlatformStatsSchema = z.object({
     platform : SocialPlatformSchema,
     count : z.number().min(0, "Follower count cannot be negative"),
})

export const companyProfileSchema = z
     .object({
          email: z.string().email({ message: "Invalid email format" }),
          addressType: z.enum(["Online", "Physical"]),
          address: z.string().optional(),
          contactNumber: z
               .string()
               .refine(
                    (val) => {
                         const phoneNumber = parsePhoneNumberFromString(val);
                         return phoneNumber?.isValid() ?? false;
                    },
                    {
                         message: "Invalid phone number. Use international format like +123456789",
                    }
               )
               .transform((val) => {
                    const phoneNumber = parsePhoneNumberFromString(val);
                    return phoneNumber?.number || val;
               }),
          contentType: z.array(contentSchema),
          profileImage: z.string().optional(), // or .nullable().optional()
          products: z.array(z.string()), // safer syntax
          establishedYear: z.number(),
          description: z.string().optional(),
          socialLinks: z.array(socialLinkSchema),
     })
     .refine(
          (data) => {
               if (data.addressType === "Physical") {
                    return !!data.address;
               }
               return true;
          },
          {
               message: "Address is required when address type is Physical",
               path: ["address"],
          }
     );

export const companyProfileUpdateSchema =
     companyProfileSchema.partial();

export const influencerProfileSchema = z.object({
     realName: z.object({
          givenName: z.string().min(1, "Given name is required"),
          middleName: z.string().optional(),
          familyName: z.string().min(1, "Family name is required"),
     }),
     displayName : z.string().min(3,"display name is required"),
     bio: z.string().optional(),
     socialMediaProfileLinks: z.array(socialLinkSchema),
     experienceYears: z.number().min(0, "Experience years cannot be negative"),
     previousSponsorships: z.array(z.string()).optional(),
     contentType: z.array(contentSchema).min(1, "At least one content type is required"),
     profileImage: z.string().optional(),
     platforms: z.array(PlatformStatsSchema).optional().default([]),
});