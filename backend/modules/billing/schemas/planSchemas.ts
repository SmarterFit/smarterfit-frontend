import { z } from "zod";

/**
 * Schema para criação de plano
 */
export const createPlanSchema = z.object({
   name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" })
      .max(50, { message: "O nome deve ter no máximo 50 caracteres" }),
   description: z
      .string()
      .max(255, { message: "A descrição deve ter no máximo 255 caracteres" })
      .optional(),
   price: z
      .number({ invalid_type_error: "O preço deve ser um número" })
      .min(0, { message: "O preço deve ser um valor positivo" }),
   duration: z
      .number({ invalid_type_error: "A duração deve ser um número" })
      .int({ message: "A duração deve ser um inteiro" })
      .min(1, { message: "A duração deve ser pelo menos 1 dia" }),
   maxUsers: z
      .number({ invalid_type_error: "O máximo de usuários deve ser um número" })
      .int({ message: "O máximo de usuários deve ser um inteiro" })
      .min(1, { message: "O máximo de usuários deve ser pelo menos 1" }),
   maxClasses: z
      .number({ invalid_type_error: "O máximo de turmas deve ser um número" })
      .int({ message: "O máximo de turmas deve ser um inteiro" })
      .min(0, { message: "O máximo de turmas deve ser pelo menos 0" }),
});
