import { z } from "zod";
import { RoleType } from "@/backend/common/enums/rolesEnum";
import { cpf } from "cpf-cnpj-validator";

/**
 * Schema para criação de usuários
 */
export const createUserSchema = z
   .object({
      name: z
         .string()
         .min(3, "Nome não pode ter menos de 3 caracteres")
         .max(50, "Nome não pode ter mais de 50 caracteres")
         .nonempty("Nome não pode estar em branco"),

      email: z
         .string()
         .email("E-mail não está no formato correto")
         .nonempty("E-mail não pode estar em branco"),

      password: z
         .string()
         .min(8, "Senha deve ter no mínimo 8 caracteres")
         .max(50, "Senha deve ter no máximo 50 caracteres")
         .nonempty("Senha não pode estar em branco"),

      confirmPassword: z
         .string()
         .min(8, "Senha deve ter no mínimo 8 caracteres")
         .max(50, "Senha deve ter no máximo 50 caracteres")
         .nonempty("Senha não pode estar em branco"),

      cpf: z
         .string()
         .nonempty("CPF não pode estar em branco")
         .refine((val) => cpf.isValid(val), {
            message: "CPF inválido",
         }),

      roles: z
         .array(z.nativeEnum(RoleType))
         .nonempty("Ao menos um cargo deve ser fornecido"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas devem coincidir",
      path: ["confirmPassword"],
   });

export type CreateUserRequestDTO = z.infer<typeof createUserSchema>;

/**
 * Schema para atualização de e-mail
 */
export const updateUserEmailSchema = z.object({
   email: z
      .string({ required_error: "O e-mail é obrigatório" })
      .email("Formato de e-mail inválido")
      .min(1, "O e-mail não pode estar em branco"),
});

export type UpdateUserEmailRequestDTO = z.infer<typeof updateUserEmailSchema>;

/**
 * Schema para atualização de senha
 */
export const updateUserPasswordSchema = z
   .object({
      password: z
         .string()
         .min(8, "A senha deve ter no mínimo 8 caracteres")
         .max(50, "A senha deve ter no máximo 50 caracteres"),
      confirmPassword: z
         .string()
         .min(8, "A confirmação deve ter no mínimo 8 caracteres")
         .max(50, "A confirmação deve ter no máximo 50 caracteres"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas devem coincidir",
      path: ["confirmPassword"],
   });

export type UpdateUserPasswordRequestDTO = z.infer<
   typeof updateUserPasswordSchema
>;

/**
 * Schema para atualização de cargos
 */
export const updateUserRolesSchema = z.object({
   roles: z
      .array(z.nativeEnum(RoleType))
      .nonempty({ message: "Pelo menos um cargo deve ser fornecido" }),
});

export type UpdateUserRolesRequestDTO = z.infer<typeof updateUserRolesSchema>;
