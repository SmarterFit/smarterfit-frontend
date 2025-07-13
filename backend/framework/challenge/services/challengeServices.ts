import { apiRequest } from "@/backend/api";
import { ChallengeGenericMetricRequestDTO } from "../schemas/challengeSchemas";

export const challengeService = {
   /**
    * Gera uma nova trilha de desafio.
    */
   generateChallenge(
      payload: ChallengeGenericMetricRequestDTO
   ): Promise<ChallengeTrailResponseDTO> {
      return apiRequest<
         ChallengeTrailResponseDTO,
         ChallengeGenericMetricRequestDTO
      >({
         method: "post",
         path: `/desafio/trilha/ia`,
         data: payload,
      });
   },
};
