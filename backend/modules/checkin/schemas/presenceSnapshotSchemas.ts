import { z } from "zod";

export const filterPresenceSnapshotRequestSchema = z.object({
   startDate: z
      .string({ required_error: "startDate cannot be null" })
      .datetime({ message: "startDate must be a valid ISO datetime" }),
   endDate: z
      .string({ required_error: "endDate cannot be null" })
      .datetime({ message: "endDate must be a valid ISO datetime" }),
});
export type FilterPresenceSnapshotRequestDTO = z.infer<
   typeof filterPresenceSnapshotRequestSchema
>;
