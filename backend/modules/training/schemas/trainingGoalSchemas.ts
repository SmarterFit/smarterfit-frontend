import { ExperienceLevel } from "@/backend/common/enums/experienceLevelEnum";
import { Goal } from "@/backend/common/enums/goalEnum";
import { z } from "zod";

export const createTrainingGoalSchema = z.object({
   goal: z.nativeEnum(Goal, {
      message: "O objetivo é obrigatório",
   }),
   experienceLevel: z.nativeEnum(ExperienceLevel, {
      message: "O nível de experiência é obrigatório",
   }),
   weeklyFrequency: z
      .number({
         message: "A frequência semanal é obrigatória",
      })
      .min(1, "A frequência semanal deve ser no mínimo 1")
      .max(7, "A frequência semanal deve ser no máximo 7"),
});
export type CreateTrainingGoalRequestDTO = z.infer<
   typeof createTrainingGoalSchema
>;
