import type { ModalityResponseDTO } from "@/backend/modules/classgroup/types/modalityTypes";
import { apiRequest } from "@/backend/api";
import { ModalityRequestDTO } from "../schemas/modalitySchemas";

export const modalityService = {
   /**
    * Cria uma nova modalidade (Admin)
    */
   create(payload: ModalityRequestDTO): Promise<ModalityResponseDTO> {
      return apiRequest<ModalityResponseDTO, ModalityRequestDTO>({
         method: "post",
         path: "/modalidade/cadastrar",
         data: payload,
      });
   },

   /**
    * Retorna uma modalidade por ID
    */
   getById(id: string): Promise<ModalityResponseDTO> {
      return apiRequest<ModalityResponseDTO>({
         method: "get",
         path: `/modalidade/${id}`,
      });
   },

   /**
    * Retorna todas as modalidades
    */
   getAll(): Promise<ModalityResponseDTO[]> {
      return apiRequest<ModalityResponseDTO[]>({
         method: "get",
         path: "/modalidade",
      });
   },

   /**
    * Busca modalidades pelo nome (filtro parcial)
    */
   searchByName(name: string): Promise<ModalityResponseDTO[]> {
      return apiRequest<ModalityResponseDTO[]>({
         method: "get",
         path: "/modalidade/buscar",
         params: { name },
      });
   },

   /**
    * Atualiza uma modalidade existente
    */
   update(
      id: string,
      payload: ModalityRequestDTO
   ): Promise<ModalityResponseDTO> {
      return apiRequest<ModalityResponseDTO, ModalityRequestDTO>({
         method: "put",
         path: `/modalidade/${id}`,
         data: payload,
      });
   },

   /**
    * Remove uma modalidade
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/modalidade/${id}`,
      });
   },
};
