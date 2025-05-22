import { z } from "zod";

export const gymCheckInAndCheckOutRequestSchema = z.object({
   userId: z
      .string({ required_error: "userId cannot be null" })
      .uuid({ message: "userId must be a valid UUID" }),
});
export type GymCheckInAndCheckOutRequestDTO = z.infer<
   typeof gymCheckInAndCheckOutRequestSchema
>;
