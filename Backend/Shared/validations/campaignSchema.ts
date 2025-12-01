import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20),
  budget: z.number().min(0),
  budgetVisibility: z.enum(["public", "masked", "private"]).default("masked"),
  budgetRange: z.string().optional(),
  platforms: z
    .array(z.enum(["instagram", "youtube", "tiktok", "twitter", "facebook"]))
    .optional(),
  // convert incoming string -> Date, then validate
  startDate: z.preprocess((val) => (val ? new Date(val as string) : val), z.date()),
  endDate: z.preprocess((val) => (val ? new Date(val as string) : val), z
    .date()
    .refine((date) => !Number.isNaN(date.getTime()), {
      message: "End date must be a valid date",
    })),
  status: z.enum(["draft", "active", "completed"]).default("draft"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});
