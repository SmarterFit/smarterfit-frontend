import { TrainingGroupType } from "@/backend/common/enums/trainingGroupEnum";

export interface TrainingGroupResponseDTO {
   id: string; // UUID como string
   name: string;
   slug: string;
   type: TrainingGroupType;
   startDate: string; // ISO date string
   endDate: string; // ISO date string
}
