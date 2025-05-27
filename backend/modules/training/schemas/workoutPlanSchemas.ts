import { z } from "zod";

export const createWorkoutPlanSchemas = z.object({
   trainingGoalId: z
      .string({
         message: "O id do objetivo de treino é obrigatório",
      })
      .uuid("O id do objetivo de treino deve ser um UUID"),
   title: z
      .string({
         message: "O título do plano de treinamento é obrigatório",
      })
      .nonempty("O título do plano de treinamento não pode ser vazio"),
   description: z
      .string({
         message: "A descrição do plano de treinamento é obrigatório",
      })
      .nonempty("A descrição do plano de treinamento não pode ser vazio"),
});
export type CreateWorkoutPlanRequestDTO = z.infer<
   typeof createWorkoutPlanSchemas
>;

export const updateWorkoutPlanSchemas = z.object({
   title: z
      .string({
         message: "O título do plano de treinamento é obrigatório",
      })
      .nonempty("O título do plano de treinamento não pode ser vazio"),
   description: z
      .string({
         message: "A descrição do plano de treinamento é obrigatório",
      })
      .nonempty("A descrição do plano de treinamento não pode ser vazio"),
});
export type UpdateWorkoutPlanRequestDTO = z.infer<
   typeof updateWorkoutPlanSchemas
>;
