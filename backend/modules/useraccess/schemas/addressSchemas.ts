import { z } from "zod";

export const createAddressSchema = z.object({
   street: z
      .string()
      .nonempty({ message: "Logradouro não pode estar em branco" })
      .max(100, { message: "Logradouro deve ter no máximo 100 caracteres" }),
   number: z
      .string()
      .nonempty({ message: "Número não pode estar em branco" })
      .max(10, { message: "Número deve ter no máximo 10 caracteres" }),
   neighborhood: z
      .string()
      .nonempty({ message: "Bairro não pode estar em branco" })
      .max(60, { message: "Bairro deve ter no máximo 60 caracteres" }),
   city: z
      .string()
      .nonempty({ message: "Cidade não pode estar em branco" })
      .max(60, { message: "Cidade deve ter no máximo 60 caracteres" }),
   cep: z
      .string()
      .nonempty({ message: "Código postal não pode estar em branco" })
      .regex(/^\d{5}-\d{3}$/, {
         message: "Código postal deve estar no formato XXXXX-XXX",
      }),
   state: z
      .string()
      .nonempty({ message: "Estado não pode estar em branco" })
      .length(2, { message: "Estado deve ter 2 caracteres" }),
});
export type CreateAddressRequestDTO = z.infer<typeof createAddressSchema>;
