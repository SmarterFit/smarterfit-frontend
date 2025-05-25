import { apiRequest } from "@/backend/api";
import {
   CreatePlanRequestDTO,
   SearchPlanRequestDTO,
   UpdatePlanRequestDTO,
} from "../schemas/planSchemas";
import { CreatedPlanResponseDTO } from "../types/planTypes";

export const planService = {
   /**
    * Cria um novo plano (admin)
    */
   createPlan(payload: CreatePlanRequestDTO): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO, CreatePlanRequestDTO>({
         method: "post",
         path: `/planos`,
         data: payload,
      });
   },

   /**
    * Busca plano pelo ID
    */
   getPlanById(id: string): Promise<CreatedPlanResponseDTO> {
      return apiRequest<CreatedPlanResponseDTO>({
         method: "get",
         path: `/planos/${id}`,
      });
   },

   /**
    * Busca todos os planos
    */
   getAllPlans(): Promise<CreatedPlanResponseDTO[]> {
      return apiRequest<CreatedPlanResponseDTO[]>({
         method: "get",
         path: `/planos`,
      });
   },

   /**
    * Busca planos com filtros e paginação
    */
   searchPlans(
      payload: SearchPlanRequestDTO,
      page?: number,
      size?: number
   ): Promise<{
      content: CreatedPlanResponseDTO[];
      totalElements: number;
      totalPages: number;
      number: number;
   }> {
      return apiRequest<{
         content: CreatedPlanResponseDTO[];
         totalElements: number;
         totalPages: number;
         number: number;
      }>({
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
   updatePlan(
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
   deletePlan(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/planos/${id}`,
      });
   },
};
