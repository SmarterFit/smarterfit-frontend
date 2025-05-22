import { Gender } from "@/backend/common/enums/genderEnum";
import { z } from "zod";

export const updateProfileSchema = z.object({
   fullName: z
      .string()
      .nonempty({ message: "Full name must not be blank" })
      .max(100, { message: "Full name must be at most 100 characters long" }),
   cpf: z
      .string()
      .nonempty({ message: "CPF must not be blank" })
      .refine((val) => /^[0-9]{11}$/.test(val), { message: "Invalid CPF" }),
   phone: z
      .string()
      .regex(/^\d{10,11}$/, {
         message: "Phone number must contain 10 or 11 digits",
      })
      .optional(),
   birthDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)) && new Date(val) < new Date(), {
         message: "Birth date must be in the past",
      }),
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
