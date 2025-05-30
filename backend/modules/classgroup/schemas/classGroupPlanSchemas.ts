import { z } from "zod";

export const CreateClassGroupPlanSchema = z.object({
  classGroupId: z.string().uuid({ message: "ClassGroup ID inválido (UUID esperado)" }),
  planId: z.string().uuid({ message: "Plan ID inválido (UUID esperado)" }),
});
