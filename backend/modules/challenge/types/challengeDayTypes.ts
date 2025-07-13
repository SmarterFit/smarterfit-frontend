import { ChallengeStepResponseDTO } from "./challengeStepTypes";

export interface ChallengeDayResponseDTO {
   id: string; // UUID representado como string
   date: string; // ISO date string
   steps: ChallengeStepResponseDTO[];
}
