import { z } from "zod";

export const createEquipmentSchema = z.object({
   name: z
      .string({
         message: "O nome do equipamento é obrigatório",
      })
      .nonempty("O nome do equipamento não pode ser vazio"),
});
export type CreateEquipmentRequestDTO = z.infer<typeof createEquipmentSchema>;
