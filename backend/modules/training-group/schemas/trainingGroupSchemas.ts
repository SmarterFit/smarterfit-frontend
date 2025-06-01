import { z } from "zod";
import { TrainingGroupType } from "@/backend/common/enums/trainingGroupEnum";

export const createTrainingGroupRequestSchema = z.object({
   name: z
      .string({ required_error: "O nome do grupo não pode ser nulo" })
      .min(3, { message: "O nome do grupo deve ter entre 3 e 100 caracteres" })
      .max(100, {
         message: "O nome do grupo deve ter entre 3 e 100 caracteres",
      }),
   type: z.nativeEnum(TrainingGroupType, {
      required_error: "O tipo do grupo não pode ser nulo",
   }),
   ownerId: z
      .string({ required_error: "O ID do proprietário não pode ser nulo" })
      .uuid({ message: "ID do proprietário inválido" }),
   startDate: z.date().optional(), // ISO date string
   endDate: z.date().optional(), // ISO date string
});
export type CreateTrainingGroupRequestDTO = z.infer<
   typeof createTrainingGroupRequestSchema
>;

export const searchTrainingGroupRequestSchema = z.object({
   nameTerm: z.string().optional(),
   userId: z.string().uuid({ message: "ID do usuário inválido" }).optional(),
   types: z.array(z.nativeEnum(TrainingGroupType)).optional(),
   includeEnded: z.boolean().optional(),
   includeNotStarted: z.boolean().optional(),
});

export type SearchTrainingGroupRequestDTO = z.infer<
   typeof searchTrainingGroupRequestSchema
>;

export const updateTrainingGroupRequestSchema = z.object({
   name: z
      .string({ required_error: "O nome do grupo não pode ser nulo" })
      .min(3, { message: "O nome do grupo deve ter entre 3 e 100 caracteres" })
      .max(100, {
         message: "O nome do grupo deve ter entre 3 e 100 caracteres",
      }),
   type: z.nativeEnum(TrainingGroupType, {
      required_error: "O tipo do grupo não pode ser nulo",
   }),
   startDate: z.date().optional(), // ISO date string
   endDate: z.date().optional(), // ISO date string
});

export type UpdateTrainingGroupRequestDTO = z.infer<
   typeof updateTrainingGroupRequestSchema
>;
