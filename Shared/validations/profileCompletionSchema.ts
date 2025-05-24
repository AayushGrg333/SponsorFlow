import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const contentSchema = z.object({
  content: z.string(),
});

const socialLinkSchema = z.object({
  type: z.enum(["website", "instagram", "linkedin", "twitter", "youtube", "facebook"]),
  url: z.string(),
});

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
