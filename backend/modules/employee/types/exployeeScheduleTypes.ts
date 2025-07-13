import { DayOfWeek } from "react-day-picker";

export interface EmployeeScheduleResponseDTO {
   id: string; /// UUID
   userId: string; /// UUID
   dayOfWeek: DayOfWeek;
   startTime: string; /// Formato ISO 8601 (HH:mm:ss)
   endTime: string; /// Formato ISO 8601 (HH:mm:ss)
}
