import { z } from "zod";

// CreatePlanRequestDTO
export const createPlanRequestSchema = z.object({
   name: z
      .string({ required_error: "O nome não pode ser nulo" })
      .min(3, { message: "O nome deve ter entre 3 e 50 caracteres" })
      .max(50, { message: "O nome deve ter entre 3 e 50 caracteres" }),
   description: z
      .string()
      .max(255, { message: "A descrição deve ter no máximo 255 caracteres" })
      .optional(),
   price: z
      .number({ required_error: "O preço não pode ser nulo" })
      .min(0.0, { message: "O preço deve ser um número positivo" }),
   duration: z
      .number({ required_error: "A duração não pode ser nula" })
      .min(1, { message: "A duração deve ser de pelo menos 1 dia" }),
   maxUsers: z
      .number({
         required_error: "O número máximo de usuários não pode ser nulo",
      })
      .min(1, { message: "O número máximo de usuários deve ser pelo menos 1" }),
   maxClasses: z
      .number({ required_error: "O número máximo de aulas não pode ser nulo" })
      .min(0, { message: "O número máximo de aulas deve ser pelo menos 0" }),
});

export type CreatePlanRequestDTO = z.infer<typeof createPlanRequestSchema>;

// SearchPlanRequestDTO
export const searchPlanRequestSchema = z.object({
   nameTerm: z.string().optional(),
   minPrice: z.number().optional(),
   maxPrice: z.number().optional(),
   minDuration: z.number().optional(),
   maxDuration: z.number().optional(),
   minMaxUsers: z.number().optional(),
   maxMaxUsers: z.number().optional(),
   minMaxClasses: z.number().optional(),
   maxMaxClasses: z.number().optional(),
   includeDeleted: z.boolean().optional(),
});

export type SearchPlanRequestDTO = z.infer<typeof searchPlanRequestSchema>;

// UpdatePlanRequestDTO
export const updatePlanRequestSchema = z.object({
   name: z
      .string({ required_error: "O nome não pode ser nulo" })
      .min(3, { message: "O nome deve ter entre 3 e 50 caracteres" })
      .max(50, { message: "O nome deve ter entre 3 e 50 caracteres" }),
   description: z
      .string()
      .max(255, { message: "A descrição deve ter no máximo 255 caracteres" })
      .optional(),
   price: z
      .number({ required_error: "O preço não pode ser nulo" })
      .min(0.0, { message: "O preço deve ser um número positivo" }),
});

export type UpdatePlanRequestDTO = z.infer<typeof updatePlanRequestSchema>;
