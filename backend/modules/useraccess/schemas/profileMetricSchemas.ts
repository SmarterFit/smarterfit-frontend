import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";
import { z } from "zod";

export const createProfileMetricSchema = z.object({
   type: z.nativeEnum(ProfileMetricType, {
      message: "O tipo da métrica deve ser fornecido",
   }),
   value: z.number({ message: "O valor da métrica deve ser fornecido" }),
});
export type CreateProfileMetricRequestDTO = z.infer<
   typeof createProfileMetricSchema
>;
