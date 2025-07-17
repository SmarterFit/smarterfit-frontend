import { DayOfWeek } from "@/backend/common/enums/dayOfWeekEnum";

export interface ClassGroupScheduleResponseDTO {
   id: string; // UUID
   classGroupId: string; // UUID
   dayOfWeek: DayOfWeek;
   startTime: string; // formato "HH:mm"
   endTime: string; // formato "HH:mm"
}

// DTO de requisição para criação
export interface CreateClassGroupScheduleRequestDTO {
   classGroupId: string; // UUID
   dayOfWeek: DayOfWeek;
   startTime: string; // formato "HH:mm"
   endTime: string; // formato "HH:mm"
}
