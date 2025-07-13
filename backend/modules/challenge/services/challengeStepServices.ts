import { apiRequest } from "@/backend/api";
import { ChallengeStepRequestDTO } from "../schemas/challengeStepSchemas";
import { ChallengeStepResponseDTO } from "../types/challengeStepTypes";

export const challengeStepService = {
   /**
    * Cria um novo passo para um desafio.
    * Corresponde ao endpoint POST /desafio/steps/cadastrar
    * @param request O corpo da requisição com os dados do passo.
    */
   create(request: ChallengeStepRequestDTO): Promise<ChallengeStepResponseDTO> {
      return apiRequest<ChallengeStepResponseDTO, ChallengeStepRequestDTO>({
         method: "post",
         path: `/desafio/steps/cadastrar`,
         data: request,
      });
   },

   /**
    * Atualiza um passo existente pelo seu ID.
    * Corresponde ao endpoint PUT /desafio/steps/{id}
    * @param id O ID do passo a ser atualizado.
    * @param request O corpo da requisição com os novos dados do passo.
    */
   update(
      id: string,
      request: ChallengeStepRequestDTO
   ): Promise<ChallengeStepResponseDTO> {
      return apiRequest<ChallengeStepResponseDTO, ChallengeStepRequestDTO>({
         method: "put",
         path: `/desafio/steps/${id}`,
         data: request,
      });
   },

   /**
    * Faz o toggle de um passo pelo seu ID.
    * Corresponde ao endpoint PUT /desafio/steps/toggle/{id}
    * @param id O ID do passo a ser atualizado.
    */
   toggle(id: string): Promise<ChallengeStepResponseDTO> {
      return apiRequest<ChallengeStepResponseDTO, ChallengeStepRequestDTO>({
         method: "patch",
         path: `/desafio/steps/toggle/${id}`,
      });
   },

   /**
    * Deleta um passo pelo seu ID.
    * Corresponde ao endpoint DELETE /desafio/steps/{id}
    * @param id O ID do passo a ser deletado.
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/desafio/steps/${id}`,
      });
   },

   /**
    * Busca todos os passos de um dia específico.
    * Corresponde ao endpoint GET /desafio/steps/day/{dayId}
    * @param dayId O ID do dia para buscar os passos.
    */
   findByDay(dayId: string): Promise<ChallengeStepResponseDTO[]> {
      return apiRequest<ChallengeStepResponseDTO[]>({
         method: "get",
         path: `/desafio/steps/day/${dayId}`,
      });
   },

   /**
    * Busca um passo específico pelo seu ID.
    * Corresponde ao endpoint GET /desafio/steps/{id}
    * @param id O ID do passo a ser buscado.
    */
   findById(id: string): Promise<ChallengeStepResponseDTO> {
      return apiRequest<ChallengeStepResponseDTO>({
         method: "get",
         path: `/desafio/steps/${id}`,
      });
   },
};
