import { z } from "zod";

/**
 * Schema para o MetricDataDTO.
 * Representa o 'Map<String, Object> data'.
 * z.record(z.string(), z.any()) é a forma de representar um mapa com chaves string e valores de qualquer tipo.
 */
export const metricDataSchema = z.object({
   data: z.record(z.string(), z.any()),
});
export type MetricDataDTO = z.infer<typeof metricDataSchema>;

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
