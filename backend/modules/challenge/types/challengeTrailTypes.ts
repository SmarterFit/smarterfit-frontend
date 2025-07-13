import { ChallengeDayResponseDTO } from "./challengeDayTypes";
import { ChallengeQuestResponseDTO } from "./challengeQuestTypes";

export interface ChallengeTrailResponseDTO {
   id: string; // UUID representado como string
   quest: ChallengeQuestResponseDTO;
   days: ChallengeDayResponseDTO[];
}
