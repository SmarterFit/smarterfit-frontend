import { z } from "zod";

/**
 * Schema para ImportMetricRequestDTO
 */
export const importMetricRequestSchema = z.object({
   sourceType: z
      .string({ required_error: "O tipo da fonte é obrigatório" })
      .min(1, { message: "O tipo da fonte não pode estar em branco" }),
   metricType: z
      .string({ required_error: "O tipo da métrica é obrigatório" })
      .min(1, { message: "O tipo da métrica não pode estar em branco" }),
});

export type ImportMetricRequestDTO = z.infer<typeof importMetricRequestSchema>;

/**
 * Schema para MetricDataDTO.
 * Representa o 'Map<String, Object> data'.
 * z.record(z.string(), z.any()) é a forma de representar um mapa com chaves string e valores de qualquer tipo.
 */
export const metricDataSchema = z.object({
   data: z.record(z.string(), z.any()),
});

export type MetricDataDTO = z.infer<typeof metricDataSchema>;

/**
 * Schema para MetricDataRequestDTO
 */
export const metricDataRequestSchema = z.object({
   metricType: z
      .string({ required_error: "O tipo da métrica é obrigatório" })
      .min(1, { message: "O tipo da métrica é obrigatório" }),
   source: z
      .string({ required_error: "A fonte é obrigatória" })
      .min(1, { message: "A fonte é obrigatória" }),
   data: z.record(z.string(), z.any(), {
      required_error: "Os dados não podem ser nulos",
   }),
});

export type MetricDataRequestDTO = z.infer<typeof metricDataRequestSchema>;

/**
 * Schema para MetricTypeRequestDTO
 */
export const metricTypeRequestSchema = z.object({
   type: z
      .string({ required_error: "O tipo da métrica é obrigatório" })
      .min(1, { message: "O tipo da métrica é obrigatório" }),
   unit: z
      .string({ required_error: "A unidade da métrica é obrigatória" })
      .min(1, { message: "A unidade da métrica é obrigatória" }),
   minThreshold: z.number({ required_error: "O limite mínimo é obrigatório" }),
   maxThreshold: z.number({ required_error: "O limite máximo é obrigatório" }),
});

export type MetricTypeRequestDTO = z.infer<typeof metricTypeRequestSchema>;
