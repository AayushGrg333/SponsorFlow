import {z} from "zod"; 



export const campaignSchema = z.object({
     title : z.string().min(5).max(100),
     description : z.string().min(20),
     budget : z.number().min(0),
     budgetVisibility : z.enum(["public", "masked", "private"]).default("masked"),
     budgetRange : z.string().optional(),
     platforms : z.array(z.enum(["instagram", "youtube", "tiktok", "twitter", "facebook"])).optional(),
     startDate : z.preprocess(
  (val) => (val ? new Date(val as string) : undefined),
  z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  })),
     endDate : z.preprocess(
  (val) => (val ? new Date(val as string) : undefined),
  z.date({
    required_error: "End date is required",
    invalid_type_error: "End date must be a valid date",
  }).refine((date) => date instanceof Date, {
    message: "End date must be a valid date",
  })),
     status : z.enum(["draft", "active", "completed"]).default("draft"),
     createdAt : z.date().default(() => new Date()),
     updatedAt : z.date().default(() => new Date()),
})
