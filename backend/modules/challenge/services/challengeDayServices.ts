import { apiRequest } from "@/backend/api";
import {
   ChallengeDayRequestCreateDTO,
   ChallengeDayRequestUpdateDTO,
} from "../schemas/challengeDaySchemas";
import { ChallengeDayResponseDTO } from "../types/challengeDayTypes";

export const challengeDayService = {
   /**
    * Cria um novo dia para um desafio.
    * Corresponde ao endpoint POST /desafio/dia
    * @param request O corpo da requisição com os dados do dia.
    */
   create(
      request: ChallengeDayRequestCreateDTO
   ): Promise<ChallengeDayResponseDTO> {
      return apiRequest<ChallengeDayResponseDTO, ChallengeDayRequestCreateDTO>({
         method: "post",
         path: `/desafio/dia`,
         data: request,
      });
   },

   /**
    * Atualiza um dia existente pelo seu ID.
    * Corresponde ao endpoint PUT /desafio/dia/{id}
    * @param id O ID do dia a ser atualizado.
    * @param request O corpo da requisição com os novos dados do dia.
    */
   update(
      id: string,
      request: ChallengeDayRequestUpdateDTO
   ): Promise<ChallengeDayResponseDTO> {
      return apiRequest<ChallengeDayResponseDTO, ChallengeDayRequestUpdateDTO>({
         method: "put",
         path: `/desafio/dia/${id}`,
         data: request,
      });
   },

   /**
    * Deleta um dia pelo seu ID.
    * Corresponde ao endpoint DELETE /desafio/dia/{id}
    * @param id O ID do dia a ser deletado.
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/desafio/dia/${id}`,
      });
   },

   /**
    * Busca todos os dias de uma trilha específica.
    * Corresponde ao endpoint GET /desafio/dia/trail/{trailId}
    * @param trailId O ID da trilha para buscar os dias.
    */
   findByTrail(trailId: string): Promise<ChallengeDayResponseDTO[]> {
      return apiRequest<ChallengeDayResponseDTO[]>({
         method: "get",
         path: `/desafio/dia/trail/${trailId}`,
      });
   },

   /**
    * Busca um dia específico pelo seu ID.
    * Corresponde ao endpoint GET /desafio/dia/{id}
    * @param id O ID do dia a ser buscado.
    */
   findById(id: string): Promise<ChallengeDayResponseDTO> {
      return apiRequest<ChallengeDayResponseDTO>({
         method: "get",
         path: `/desafio/dia/${id}`,
      });
   },
};
