import { apiRequest } from "@/backend/api";
import { ChallengeTypeResponseDTO } from "../types/challengeTypes";

export const challengeTypeService = {
   /**
    * Busca todos os tipos de desafio que estão habilitados.
    * Corresponde ao endpoint GET /desafio/trilha/tipo
    */
   getEnabledChallengeTypes(): Promise<ChallengeTypeResponseDTO[]> {
      return apiRequest<ChallengeTypeResponseDTO[]>({
         method: "get",
         path: `/desafio/trilha/tipo`,
      });
   },
};
