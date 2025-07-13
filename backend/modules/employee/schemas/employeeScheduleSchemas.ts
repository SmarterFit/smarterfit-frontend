import { DayOfWeek } from "@/backend/common/enums/dayOfWeekEnum";
import { z } from "zod";

/**
 * Schema para EmployeeSchedulerRequestDTO
 */
export const employeeSchedulerRequestSchema = z.object({
   /**
    * Corresponde a '@NotNull private UUID userId'.
    */
   userId: z
      .string()
      .uuid({ message: "O ID do usuário deve ser um UUID válido" }),

   /**
    * Corresponde a '@NotNull private DayOfWeek dayOfWeek'.
    */
   dayOfWeek: z.nativeEnum(DayOfWeek, {
      required_error: "O dia da semana é obrigatório",
   }),

   /**
    * Corresponde a 'private LocalTime startTime' com formato HH:mm.
    * Valida uma string no formato 24 horas (ex: "08:00", "23:59").
    */
   startTime: z
      .string({ required_error: "A hora de início é obrigatória" })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
         message: "A hora de início deve estar no formato HH:mm",
      }),

   /**
    * Corresponde a 'private LocalTime endTime' com formato HH:mm.
    * Valida uma string no formato 24 horas (ex: "09:30", "18:45").
    */
   endTime: z
      .string({ required_error: "A hora de término é obrigatória" })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
         message: "A hora de término deve estar no formato HH:mm",
      }),
});

/**
 * Tipo inferido a partir do schema para EmployeeSchedulerRequestDTO.
 */
export type EmployeeSchedulerRequestDTO = z.infer<
   typeof employeeSchedulerRequestSchema
>;
