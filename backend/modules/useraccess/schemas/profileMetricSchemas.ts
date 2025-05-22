import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";
import { z } from "zod";

export const createProfileMetricSchema = z.object({
   type: z.nativeEnum(ProfileMetricType),
   value: z.number(),
});
export type CreateProfileMetricRequestDTO = z.infer<
   typeof createProfileMetricSchema
>;
