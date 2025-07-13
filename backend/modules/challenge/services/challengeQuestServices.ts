import { apiRequest } from "@/backend/api";
import { ChallengeQuestRequestDTO } from "../schemas/challengeQuestSchemas";
import { ChallengeQuestResponseDTO } from "../types/challengeQuestTypes";

export const challengeQuestService = {
   /**
    * Cria uma nova missão de desafio.
    * Corresponde ao endpoint POST /desafio/form/cadastrar
    * @param requestDTO O corpo da requisição com os dados da missão.
    */
   createChallengeQuest(
      requestDTO: ChallengeQuestRequestDTO
   ): Promise<ChallengeQuestResponseDTO> {
      return apiRequest<ChallengeQuestResponseDTO, ChallengeQuestRequestDTO>({
         method: "post",
         path: `/desafio/form/cadastrar`,
         data: requestDTO,
      });
   },

   /**
    * Busca uma missão de desafio específica pelo seu ID.
    * Corresponde ao endpoint GET /desafio/form/{id}
    * @param id O ID da missão a ser buscada.
    */
   getChallengeQuestById(id: string): Promise<ChallengeQuestResponseDTO> {
      return apiRequest<ChallengeQuestResponseDTO>({
         method: "get",
         path: `/desafio/form/${id}`,
      });
   },

   /**
    * Atualiza uma missão de desafio existente pelo seu ID.
    * Corresponde ao endpoint PUT /desafio/form/{id}
    * @param id O ID da missão a ser atualizada.
    * @param requestDTO O corpo da requisição com os novos dados da missão.
    */
   updateChallengeQuest(
      id: string,
      requestDTO: ChallengeQuestRequestDTO
   ): Promise<ChallengeQuestResponseDTO> {
      return apiRequest<ChallengeQuestResponseDTO, ChallengeQuestRequestDTO>({
         method: "put",
         path: `/desafio/form/${id}`,
         data: requestDTO,
      });
   },

   /**
    * Deleta uma missão de desafio pelo seu ID.
    * Corresponde ao endpoint DELETE /desafio/form/delete/{id}
    * @param id O ID da missão a ser deletada.
    */
   deleteChallengeQuest(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/desafio/form/delete/${id}`,
      });
   },
};
