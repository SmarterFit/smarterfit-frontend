import { z } from "zod";

// --- Schemas Específicos para o campo 'data' ---
// Criamos schemas individuais para os dados de cada tipo de métrica.
// Isso elimina o `z.any()` e nos dá segurança total de tipo.

const educationCreditDataSchema = z.object({
   hours: z.coerce.number().int().min(0, "As horas não podem ser negativas."),
   courseName: z.string().min(1, "O nome do curso é obrigatório."),
   institution: z.string().min(1, "O nome da instituição é obrigatório."),
   completionDate: z
      .string({ required_error: "A data de conclusão é obrigatória." })
      .min(1, "A data de conclusão é obrigatória.")
      .refine((dateString) => !isNaN(Date.parse(dateString)), {
         message: "Data inválida.",
      }),
   userId: z.string().min(1, "ID do usuário é obrigatório."),
});

// --- Schemas de Requisição Ajustados ---

export const importMetricRequestSchema = z.object({
   sourceType: z.string({
      required_error: "O tipo da fonte é obrigatório",
   }),
   metricType: z.enum(["Créditos de Educação"], {
      required_error: "O tipo da métrica é obrigatório",
   }),
});

export type ImportMetricRequestDTO = z.infer<typeof importMetricRequestSchema>;

export const metricDataRequestSchema = z.discriminatedUnion(
   "metricType",
   [
      z.object({
         metricType: z.literal("Créditos de Educação"),
         source: z.string().min(1, "A fonte é obrigatória"),
         data: educationCreditDataSchema, // <-- Schema específico aqui
      }),
   ],
   { required_error: "O tipo da métrica é inválido ou não suportado." }
);

export type MetricDataRequestDTO = z.infer<typeof metricDataRequestSchema>;

export const metricTypeRequestSchema = z
   .object({
      type: z
         .string({ required_error: "O tipo da métrica é obrigatório" })
         .min(1, { message: "O tipo da métrica é obrigatório" }),
      unit: z
         .string({ required_error: "A unidade da métrica é obrigatória" })
         .min(1, { message: "A unidade da métrica é obrigatória" }),
      minThreshold: z.number({
         required_error: "O limite mínimo é obrigatório",
      }),
      maxThreshold: z.number({
         required_error: "O limite máximo é obrigatório",
      }),
   })
   .refine((data) => data.maxThreshold >= data.minThreshold, {
      message: "O limite máximo não pode ser menor que o limite mínimo.",
      path: ["maxThreshold"],
   });

export type MetricTypeRequestDTO = z.infer<typeof metricTypeRequestSchema>;
