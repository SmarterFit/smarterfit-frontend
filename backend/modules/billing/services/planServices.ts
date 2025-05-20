import type {
   CreatedPlanResponseDTO,
   SearchPlanRequestDTO,
   CreatePlanRequestDTO,
} from "@/backend/modules/billing/types/planTypes";
import type { PageResponseDTO } from "@/backend/common/types/pageTypes";
import { apiRequest } from "@/backend/api";

export const planService = {
   /**
    * Cria um novo plano (Admin)
    */
   create(payload: CreatePlanRequestDTO): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO, CreatePlanRequestDTO>({
         method: "post",
         path: "/planos",
         data: payload,
      });
   },

   /**
    * Retorna um plano por ID
    */
   getById(id: string): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO>({
         method: "get",
         path: `/planos/${id}`,
      });
   },

   /**
    * Retorna todos os planos
    */
   getAll(): Promise<CreatedPlanResponseDTO[]> {
      return apiRequest<CreatedPlanResponseDTO[]>({
         method: "get",
         path: "/planos",
      });
   },

   /**
    * Busca planos com filtros e paginação
    */
   search(
      filters: SearchPlanRequestDTO = {},
      page = 0,
      size = 10
   ): Promise<PageResponseDTO<CreatedPlanResponseDTO>> {
      return apiRequest<PageResponseDTO<CreatedPlanResponseDTO>>({
         method: "get",
         path: "/planos/buscar",
         params: { ...filters, page, size },
      });
   },

   /**
    * Atualiza um plano existente (Admin)
    */
   update(
      id: string,
      payload: CreatePlanRequestDTO
   ): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO, CreatePlanRequestDTO>({
         method: "put",
         path: `/planos/${id}`,
         data: payload,
      });
   },

   /**
    * Remove um plano (Admin)
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/planos/${id}`,
      });
   },
};
