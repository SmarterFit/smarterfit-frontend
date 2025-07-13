import { metricDataSchema } from "@/backend/modules/useraccess/schemas/userMetricSchemas";
import { z } from "zod";

/**
 * Schema para o ChallengeGenericMetricRequestDTO.
 */
export const challengeGenericMetricRequestSchema = z.object({
   challengeQuestId: z
      .string()
      .uuid({ message: "O ID da missão do desafio deve ser um UUID válido" }),
   metricDataDTO: metricDataSchema.optional(),
});
export type ChallengeGenericMetricRequestDTO = z.infer<
   typeof challengeGenericMetricRequestSchema
>;
