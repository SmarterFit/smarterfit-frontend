import { z } from "zod";

export const challengeDayRequestCreateSchema = z.object({
   date: z.coerce.date({ required_error: "A data é obrigatória" }),
   trailId: z.string().uuid({ message: "O ID da trilha é obrigatório" }),
   steps: z.array(z.string().uuid()).optional(),
   challengeTrailId: z
      .string()
      .uuid({ message: "O ID da trilha de desafio é obrigatório" }),
});

export type ChallengeDayRequestCreateDTO = z.infer<
   typeof challengeDayRequestCreateSchema
>;

/**
 * Schema para ChallengeDayRequestUpdateDTO
 */
export const challengeDayRequestUpdateSchema = z.object({
   date: z.coerce.date({ required_error: "A data é obrigatória" }),
});

export type ChallengeDayRequestUpdateDTO = z.infer<
   typeof challengeDayRequestUpdateSchema
>;
