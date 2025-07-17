import { SessionStatus } from "@/backend/common/enums/sessionStatus";

export interface CreateClassSessionRequestDTO {
   classGroupId: string; // UUID
   description?: string;
   startTime: string; // formato "dd-MM-yyyy HH:mm:ss"
   endTime: string;
   status: SessionStatus; // Enum: SCHEDULED, CONFIRMED, CANCELLED
   capacity?: number;
}

export interface UpdateClassSessionRequestDTO {
   description?: string;
   startTime: string;
   endTime: string;
   status: SessionStatus;
   capacity?: number;
}

export interface ClassSessionResponseDTO {
   id: string;
   description?: string;
   classGroupId: string;
   status: SessionStatus;
   startTime: string;
   endTime: string;
}
