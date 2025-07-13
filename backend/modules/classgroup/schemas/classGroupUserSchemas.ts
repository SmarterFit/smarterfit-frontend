import { z } from "zod";

export const MemberClassGroupUserSchema = z.object({
  classGroupId: z.string().uuid({ message: "ClassGroup ID inválido (UUID esperado)" }),
  userId: z.string().uuid({ message: "User ID inválido (UUID esperado)" }),
  subscriptionId: z.string().uuid({ message: "Subscription ID inválido (UUID esperado)" }),
});

export const EmployeeClassGroupUserSchema = z.object({
  classGroupId: z.string().uuid({ message: "ClassGroup ID inválido (UUID esperado)" }),
});
