import { z } from "zod";

export const challengeStepRequestSchema = z.object({
   description: z
      .string({ required_error: "A descrição é obrigatória" })
      .min(1, { message: "A descrição é obrigatória" }),
   completed: z.boolean().optional().default(false),
   challengeDayId: z
      .string()
      .uuid({ message: "O ID do dia do desafio deve ser um UUID válido" }),
});

export type ChallengeStepRequestDTO = z.infer<
   typeof challengeStepRequestSchema
>;
