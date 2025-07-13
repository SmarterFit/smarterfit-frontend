import { z } from "zod";

export const challengeTrailRequestSchema = z.object({
   challengeQuestId: z
      .string()
      .uuid({ message: "O ID da missão do desafio deve ser um UUID válido" }),
   challengeDayIds: z.array(z.string().uuid()).optional(),
});

export type ChallengeTrailRequestDTO = z.infer<
   typeof challengeTrailRequestSchema
>;
