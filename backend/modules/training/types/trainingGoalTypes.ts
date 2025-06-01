import { ExperienceLevel } from "@/backend/common/enums/experienceLevelEnum";
import { Goal } from "@/backend/common/enums/goalEnum";

export interface TrainingGoalResponseDTO {
   id: string;
   goal: Goal;
   experienceLevel: ExperienceLevel;
   weeklyFrequency: number;
}
