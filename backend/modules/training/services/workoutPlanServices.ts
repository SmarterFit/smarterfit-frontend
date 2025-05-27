import { apiRequest } from "@/backend/api";
import { WorkoutPlanResponseDTO } from "../types/workoutPlanTypes";
import {
   CreateWorkoutPlanRequestDTO,
   UpdateWorkoutPlanRequestDTO,
} from "../schemas/workoutPlanSchemas";

/**
 * Service para chamadas à API de planos de treino
 */
export const workoutPlanService = {
   /**
    * Cria um novo plano de treino
    */
   create(
      payload: CreateWorkoutPlanRequestDTO
   ): Promise<WorkoutPlanResponseDTO> {
      return apiRequest<WorkoutPlanResponseDTO, CreateWorkoutPlanRequestDTO>({
         method: "post",
         path: `/treinos/plano/cadastrar`,
         data: payload,
      });
   },

   /**
    * Obtém o plano de treino pelo ID do usuário
    */
   getByUserId(): Promise<WorkoutPlanResponseDTO> {
      return apiRequest<WorkoutPlanResponseDTO>({
         method: "get",
         path: `/treinos/plano`,
      });
   },

   /**
    * Obtém o plano de treino pelo ID
    */
   getById(id: string): Promise<WorkoutPlanResponseDTO> {
      return apiRequest<WorkoutPlanResponseDTO>({
         method: "get",
         path: `/treinos/plano/${id}`,
      });
   },

   /**
    * Atualiza o plano de treino
    */
   update(
      payload: CreateWorkoutPlanRequestDTO
   ): Promise<WorkoutPlanResponseDTO> {
      return apiRequest<WorkoutPlanResponseDTO, CreateWorkoutPlanRequestDTO>({
         method: "put",
         path: `/treinos/plano`,
         data: payload,
      });
   },

   /**
    * Exclui o plano de treino pelo ID do usuário
    */
   delete(): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/treinos/plano`,
      });
   },
};
