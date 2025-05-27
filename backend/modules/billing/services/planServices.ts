import { apiRequest } from "@/backend/api";
import {
   CreatePlanRequestDTO,
   SearchPlanRequestDTO,
   UpdatePlanRequestDTO,
} from "../schemas/planSchemas";
import { CreatedPlanResponseDTO } from "../types/planTypes";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";

export const planService = {
   /**
    * Cria um novo plano (admin)
    */
   create(payload: CreatePlanRequestDTO): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO, CreatePlanRequestDTO>({
         method: "post",
         path: `/planos`,
         data: payload,
      });
   },

   /**
    * Busca plano pelo ID
    */
   getById(id: string): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO>({
         method: "get",
         path: `/planos/${id}`,
      });
   },

   /**
    * Busca todos os planos
    */
   getAll(): Promise<CreatedPlanResponseDTO[]> {
      return apiRequest<CreatedPlanResponseDTO[]>({
         method: "get",
         path: `/planos`,
      });
   },

   /**
    * Busca planos com filtros e paginação
    */
   search(
      payload: SearchPlanRequestDTO,
      page?: number,
      size?: number
   ): Promise<PageResponseDTO<CreatedPlanResponseDTO>> {
      return apiRequest<PageResponseDTO<CreatedPlanResponseDTO>>({
         method: "get",
         path: `/planos/buscar`,
         params: {
            ...payload,
            page,
            size,
         },
      });
   },

   /**
    * Atualiza plano pelo ID (admin)
    */
   update(
      id: string,
      payload: UpdatePlanRequestDTO
   ): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO, UpdatePlanRequestDTO>({
         method: "put",
         path: `/planos/${id}`,
         data: payload,
      });
   },

   /**
    * Deleta plano pelo ID (admin)
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/planos/${id}`,
      });
   },
};
