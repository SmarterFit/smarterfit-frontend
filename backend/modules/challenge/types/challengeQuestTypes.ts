import { ExperienceLevel } from "@/backend/common/enums/experienceLevelEnum";
import { ChallengeTypeResponseDTO } from "@/backend/framework/challenge/types/challengeTypes";
import { DayOfWeek } from "react-day-picker";

export interface ChallengeQuestResponseDTO {
   id: string; // UUID representado como string
   metricType: MetricTypeResponseDTO;
   title: string;
   challengeType: ChallengeTypeResponseDTO;
   experienceLevel: ExperienceLevel;
   daysOfWeek: DayOfWeek[];
   description: string;
   startDate: string; // ISO date string
   endDate: string; // ISO date string
}
