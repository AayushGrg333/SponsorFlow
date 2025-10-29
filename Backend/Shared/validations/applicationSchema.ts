import {z} from "zod";

export const applicationSchema = z.object({
     message: z.string().max(500).optional(),
})