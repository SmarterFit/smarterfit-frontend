import { z } from "zod";
import { CheckInStatus } from "@/backend/common/enums/checkInStatusEnum";

export const classCheckInRequestSchema = z.object({
   userId: z
      .string({ required_error: "userId cannot be null" })
      .uuid({ message: "userId must be a valid UUID" }),
   classSessionId: z
      .string({ required_error: "classSessionId cannot be null" })
      .uuid({ message: "classSessionId must be a valid UUID" }),
   status: z.nativeEnum(CheckInStatus, {
      required_error: "status cannot be null",
      invalid_type_error: "status must be one of the CheckInStatus values",
   }),
});

export type ClassCheckInRequestDTO = z.infer<typeof classCheckInRequestSchema>;
