import { apiRequest } from "@/backend/api";
import { ChallengeTrailRequestDTO } from "../schemas/challengeTrailSchemas";
import { ChallengeTrailResponseDTO } from "../types/challengeTrailTypes";

export const challengeTrailService = {
   /**
    * Cria uma nova trilha de desafio.
    * Corresponde ao endpoint POST /desafio/trilha
    * @param request O corpo da requisição com os dados da trilha.
    */
   create(
      request: ChallengeTrailRequestDTO
   ): Promise<ChallengeTrailResponseDTO> {
      return apiRequest<ChallengeTrailResponseDTO, ChallengeTrailRequestDTO>({
         method: "post",
         path: `/desafio/trilha`,
         data: request,
      });
   },

   /**
    * Deleta uma trilha de desafio pelo seu ID.
    * Corresponde ao endpoint DELETE /desafio/trilha/{id}
    * @param id O ID da trilha a ser deletada.
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/desafio/trilha/${id}`,
      });
   },

   /**
    * Busca uma trilha de desafio específica pelo seu ID.
    * Corresponde ao endpoint GET /desafio/trilha/{id}
    * @param id O ID da trilha a ser buscada.
    */
   findById(id: string): Promise<ChallengeTrailResponseDTO> {
      return apiRequest<ChallengeTrailResponseDTO>({
         method: "get",
         path: `/desafio/trilha/${id}`,
      });
   },

   /**
    * Busca uma trilha de desafio específica pelo id do desafio.
    * Corresponde ao endpoint GET /desafio/trilha/quest/{id}
    * @param id O ID da trilha a ser buscada.
    */
   findByQuestId(questId: string): Promise<ChallengeTrailResponseDTO> {
      return apiRequest<ChallengeTrailResponseDTO>({
         method: "get",
         path: `/desafio/trilha/quest/${questId}`,
      });
   },
};
