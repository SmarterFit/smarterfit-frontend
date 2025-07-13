import { DayOfWeek } from "@/backend/common/enums/dayOfWeekEnum";
import { ExperienceLevel } from "@/backend/common/enums/experienceLevelEnum";
import { format } from "date-fns";
import { z } from "zod";

export const challengeQuestRequestSchema = z.object({
   metricTypeId: z
      .string()
      .uuid({ message: "O ID do tipo de métrica deve ser um UUID válido" }),
   title: z
      .string()
      .min(1, { message: "O título é obrigatório" })
      .max(100, { message: "O título deve ter no máximo 100 caracteres" }),
   challengeType: z
      .string()
      .min(1, { message: "O tipo de desafio é obrigatório" })
      .max(50, {
         message: "O tipo de desafio deve ter no máximo 50 caracteres",
      }),
   experienceLevel: z.nativeEnum(ExperienceLevel, {
      invalid_type_error: "Nível de experiência inválido",
   }),
   daysOfWeek: z
      .array(z.nativeEnum(DayOfWeek))
      .min(1, { message: "Pelo menos um dia da semana deve ser selecionado" }),
   description: z
      .string()
      .min(1, { message: "A descrição é obrigatória" })
      .max(500, { message: "A descrição deve ter no máximo 500 caracteres" }),
   startDate: z.coerce.date({
      required_error: "A data de início é obrigatória",
   }),
   endDate: z.coerce.date({
      required_error: "A data de término é obrigatória",
   }),
});

export type ChallengeQuestRequestDTO = z.infer<
   typeof challengeQuestRequestSchema
>;
