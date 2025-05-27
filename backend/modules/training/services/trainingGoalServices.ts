import { apiRequest } from "@/backend/api";
import { CreateTrainingGoalRequestDTO } from "../schemas/trainingGoalSchemas";
import { TrainingGoalResponseDTO } from "../types/trainingGoalTypes";

/**
 * Service para chamadas à API de objetivos de treino
 */
export const trainingGoalService = {
   /**
    * Cria um novo objetivo de treino
    */
   create(
      payload: CreateTrainingGoalRequestDTO
   ): Promise<TrainingGoalResponseDTO> {
      return apiRequest<TrainingGoalResponseDTO, CreateTrainingGoalRequestDTO>({
         method: "post",
         path: `/treinos/objetivos/cadastrar`,
         data: payload,
      });
   },

   /**
    * Obtém o objetivo de treino pelo ID do usuário
    */
   getByUserId(): Promise<TrainingGoalResponseDTO> {
      return apiRequest<TrainingGoalResponseDTO>({
         method: "get",
         path: `/treinos/objetivos`,
      });
   },

   /**
    * Atualiza o objetivo de treino
    */
   update(
      payload: CreateTrainingGoalRequestDTO
   ): Promise<TrainingGoalResponseDTO> {
      return apiRequest<TrainingGoalResponseDTO, CreateTrainingGoalRequestDTO>({
         method: "put",
         path: `/treinos/objetivos/atualizar`,
         data: payload,
      });
   },
};
