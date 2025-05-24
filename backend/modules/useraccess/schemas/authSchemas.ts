import { z } from "zod";

export const loginRequestSchema = z.object({
   email: z
      .string()
      .email("E-mail não é valido")
      .nonempty("E-mail não pode estar em branco"),
   password: z.string().nonempty("Senha não pode estar em branco"),
});

export type LoginRequestDTO = z.infer<typeof loginRequestSchema>;
