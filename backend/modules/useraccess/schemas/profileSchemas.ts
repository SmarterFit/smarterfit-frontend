import { Gender } from "@/backend/common/enums/genderEnum";
import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const updateProfileSchema = z.object({
   fullName: z
      .string()
      .nonempty({ message: "Full name must not be blank" })
      .max(100, { message: "Full name must be at most 100 characters long" }),
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
            "Phone number must be in the format (99) 99999-9999 or (99) 9999-9999",
      })
      .optional(),
   birthDate: z
      .date()
      .refine((val) => new Date(val) < new Date(), {
         message: "Birth date must be in the past",
      })
      .optional(),
   gender: z.nativeEnum(Gender),
});
export type UpdateProfileRequestDTO = z.infer<typeof updateProfileSchema>;

export const searchProfileSchema = z.object({
   fullNameTerm: z.string().optional(),
   cpfTerm: z.string().optional(),
   phoneTerm: z.string().optional(),
   birthDateFrom: z.string().optional(),
   birthDateTo: z.string().optional(),
   gender: z.array(z.nativeEnum(Gender)).optional(),
});
export type SearchProfileRequestDTO = z.infer<typeof searchProfileSchema>;
