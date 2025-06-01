import { z } from "zod";

export const gymCheckInAndCheckOutRequestSchema = z.object({
   userId: z
      .string({ required_error: "O id do usuário não pode ser nulo" })
      .uuid({ message: "O id do usuário deve ser um UUID válido" }),
});
export type GymCheckInAndCheckOutRequestDTO = z.infer<
   typeof gymCheckInAndCheckOutRequestSchema
>;

export const filterGymCheckInRequestSchema = z.object({
   userId: z
      .string({ required_error: "O id do usuário não pode ser nulo" })
      .uuid({ message: "O id do usuário deve ser um UUID válido" }),
   startDate: z
      .string({ required_error: "A data inicial não pode ser nula" })
      .datetime({ message: "A data inicial deve ser uma data/hora válida" }),
   endDate: z
      .string({ required_error: "A data final não pode ser nula" })
      .datetime({ message: "A data final deve ser uma data/hora válida" }),
});

export type FilterGymCheckInRequestDTO = z.infer<
   typeof filterGymCheckInRequestSchema
>;
