import { Gender } from "@/backend/common/enums/genderEnum";
import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const updateProfileSchema = z.object({
   fullName: z
      .string()
      .nonempty({ message: "O nome não pode estar em branco" })
      .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
   cpf: z
      .string()
      .nonempty("CPF não pode estar em branco")
      .refine((val) => cpf.isValid(val), {
         message: "CPF inválido",
      }),
   phone: z
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
         message:
            "O telefone deve estar no formato (XX) XXXXX-XXXX, onde X é um número",
      })
      .optional(),
   birthDate: z
      .date()
      .refine((val) => new Date(val) < new Date(), {
         message: "A data de nascimento deve ser menor que a data atual",
      })
      .optional(),
   gender: z.nativeEnum(Gender).optional(),
});
export type UpdateProfileRequestDTO = z.infer<typeof updateProfileSchema>;

export const searchProfileSchema = z.object({
   fullNameTerm: z.string().optional(),
   phoneTerm: z.string().optional(),
   birthDateFrom: z.string().optional(),
   birthDateTo: z.string().optional(),
   gender: z.array(z.nativeEnum(Gender)).optional(),
});
export type SearchProfileRequestDTO = z.infer<typeof searchProfileSchema>;
