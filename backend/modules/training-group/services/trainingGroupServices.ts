import { apiRequest } from "@/backend/api";
import {
   CreateTrainingGroupRequestDTO,
   SearchTrainingGroupRequestDTO,
   UpdateTrainingGroupRequestDTO,
} from "../schemas/trainingGroupSchemas";
import { TrainingGroupResponseDTO } from "../types/trainingGroupTypes";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";

export const trainingGroupService = {
   /**
    * Cria um novo grupo de treinamento
    */
   create(
      payload: CreateTrainingGroupRequestDTO
   ): Promise<TrainingGroupResponseDTO> {
      return apiRequest<
         TrainingGroupResponseDTO,
         CreateTrainingGroupRequestDTO
      >({
         method: "post",
         path: `/grupos-de-treinamento`,
         data: payload,
      });
   },

   /**
    * Busca um grupo de treinamento pelo ID
    */
   getById(id: string): Promise<TrainingGroupResponseDTO> {
      return apiRequest<TrainingGroupResponseDTO>({
         method: "get",
         path: `/grupos-de-treinamento/${id}`,
      });
   },

   /**
    * Busca todos os grupos de treinamento
    */
   getAll(): Promise<TrainingGroupResponseDTO[]> {
      return apiRequest<TrainingGroupResponseDTO[]>({
         method: "get",
         path: `/grupos-de-treinamento`,
      });
   },

   /**
    * Busca grupos de treinamento com filtros (com paginação)
    */
   search(
      payload: SearchTrainingGroupRequestDTO,
      page?: number,
      size?: number
   ): Promise<PageResponseDTO<TrainingGroupResponseDTO>> {
      return apiRequest<PageResponseDTO<TrainingGroupResponseDTO>>({
         method: "get",
         path: `/grupos-de-treinamento/buscar`,
         params: {
            ...payload,
            page,
            size,
         },
      });
   },

   /**
    * Atualiza um grupo de treinamento pelo ID
    */
   update(
      id: string,
      payload: UpdateTrainingGroupRequestDTO
   ): Promise<TrainingGroupResponseDTO> {
      return apiRequest<
         TrainingGroupResponseDTO,
         UpdateTrainingGroupRequestDTO
      >({
         method: "put",
         path: `/grupos-de-treinamento/${id}`,
         data: payload,
      });
   },

   /**
    * Deleta um grupo de treinamento pelo ID
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/grupos-de-treinamento/${id}`,
      });
   },

   /**
    * Ativa um grupo de treinamento
    */
   activate(id: string): Promise<TrainingGroupResponseDTO> {
      return apiRequest<TrainingGroupResponseDTO>({
         method: "patch",
         path: `/grupos-de-treinamento/${id}/ativar`,
      });
   },

   /**
    * Finaliza um grupo de treinamento
    */
   finish(id: string): Promise<TrainingGroupResponseDTO> {
      return apiRequest<TrainingGroupResponseDTO>({
         method: "patch",
         path: `/grupos-de-treinamento/${id}/finalizar`,
      });
   },

   /**
    * Reinicia um grupo de treinamento
    */
   restart(id: string): Promise<TrainingGroupResponseDTO> {
      return apiRequest<TrainingGroupResponseDTO>({
         method: "patch",
         path: `/grupos-de-treinamento/${id}/reiniciar`,
      });
   },
};
