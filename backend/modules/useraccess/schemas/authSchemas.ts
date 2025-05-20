import { z } from "zod";

export const loginRequestSchema = z.object({
   email: z
      .string()
      .email("Email must be a valid format")
      .nonempty("Email must not be blank"),
   password: z.string().nonempty("The password must not be empty"),
});

export type LoginRequestDTO = z.infer<typeof loginRequestSchema>;
