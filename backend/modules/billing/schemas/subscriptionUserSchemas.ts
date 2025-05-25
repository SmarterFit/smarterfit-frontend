import { z } from "zod";

export const addMemberByEmailRequestSchema = z.object({
   subscriptionId: z
      .string({ required_error: "O ID da assinatura não pode ser nulo" })
      .uuid({ message: "O ID da assinatura deve ser um UUID válido" }),

   userEmail: z
      .string({ required_error: "O e-mail do usuário não pode ser nulo" })
      .min(1, { message: "O e-mail do usuário não pode estar em branco" })
      .email({ message: "O e-mail do usuário deve ser um e-mail válido" }),
});

export type AddMemberByEmailRequestDTO = z.infer<
   typeof addMemberByEmailRequestSchema
>;
