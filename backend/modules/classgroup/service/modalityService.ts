import type { ModalityRequestDTO, ModalityResponseDTO } from "@/backend/modules/classgroup/types/modalityTypes";
import { apiRequest } from "@/backend/api";

export const modalityService = {
   /**
    * Cria uma nova modalidade (Admin)
    */
   create(payload: ModalityRequestDTO): Promise<ModalityResponseDTO> {
      return apiRequest<ModalityResponseDTO, ModalityRequestDTO>({
         method: "post",
         path: "/modalidades",
         data: payload,
      });
   },

   /**
    * Retorna uma modalidade por ID
    */
   getById(id: string): Promise<ModalityResponseDTO> {
      return apiRequest<ModalityResponseDTO>({
         method: "get",
         path: `/modalidades/${id}`,
      });
   },

   /**
    * Retorna todas as modalidades
    */
   getAll(): Promise<ModalityResponseDTO[]> {
      return apiRequest<ModalityResponseDTO[]>({
         method: "get",
         path: "/modalidades",
      });
   },

   /**
    * Busca modalidades pelo nome (filtro parcial)
    */
   searchByName(name: string): Promise<ModalityResponseDTO[]> {
      return apiRequest<ModalityResponseDTO[]>({
         method: "get",
         path: "/modalidades/buscar",
         params: { name },
      });
   },

   /**
    * Atualiza uma modalidade existente
    */
   update(id: string, payload: ModalityRequestDTO): Promise<ModalityResponseDTO> {
      return apiRequest<ModalityResponseDTO, ModalityRequestDTO>({
         method: "put",
         path: `/modalidades/${id}`,
         data: payload,
      });
   },

   /**
    * Remove uma modalidade
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/modalidades/${id}`,
      });
   },
};
