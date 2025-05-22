import { z } from "zod";

export const createAddressSchema = z.object({
   street: z
      .string()
      .nonempty({ message: "Street must not be blank" })
      .max(100, { message: "Street must be at most 100 characters long" }),
   number: z
      .string()
      .nonempty({ message: "Number must not be blank" })
      .max(10, { message: "Number must be at most 10 characters long" }),
   neighborhood: z
      .string()
      .nonempty({ message: "Neighborhood must not be blank" })
      .max(60, { message: "Neighborhood must be at most 60 characters long" }),
   city: z
      .string()
      .nonempty({ message: "City must not be blank" })
      .max(60, { message: "City must be at most 60 characters long" }),
   cep: z
      .string()
      .nonempty({ message: "Postal code must not be blank" })
      .regex(/^\d{5}-\d{3}$/, {
         message: "Postal code must be in the format XXXXX-XXX",
      }),
   state: z
      .string()
      .nonempty({ message: "State must not be blank" })
      .length(2, { message: "State must be a 2-letter abbreviation" }),
});
export type CreateAddressRequestDTO = z.infer<typeof createAddressSchema>;
