import { z } from "zod";

export const addMemberByEmailRequestSchema = z.object({
   email: z
      .string({ required_error: "O email não pode ser nulo" })
      .email({ message: "Formato de email inválido" }),
   trainingGroupId: z
      .string({ required_error: "O ID do grupo de treino não pode ser nulo" })
      .uuid({ message: "ID do grupo de treino inválido" }),
});

export type AddMemberByEmailRequestDTO = z.infer<
   typeof addMemberByEmailRequestSchema
>;
