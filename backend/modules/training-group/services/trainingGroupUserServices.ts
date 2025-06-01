import { apiRequest } from "@/backend/api";
import { AddMemberByEmailRequestDTO } from "../schemas/trainingGroupUserSchemas";
import { TrainingGroupUserResponseDTO } from "../types/trainingGroupUserTypes";
import { TrainingGroupResponseDTO } from "../types/trainingGroupTypes";

export const trainingGroupUserService = {
   /**
    * Adiciona um usuário ao grupo de treinamento por IDs
    */
   addUserToTrainingGroup(
      groupId: string,
      userId: string
   ): Promise<TrainingGroupUserResponseDTO> {
      return apiRequest<TrainingGroupUserResponseDTO>({
         method: "post",
         path: `/grupos-de-treinamento/usuarios/${groupId}/usuario/${userId}/adicionar`,
      });
   },

   /**
    * Adiciona um membro ao grupo de treinamento por e-mail
    */
   addMemberByEmail(
      payload: AddMemberByEmailRequestDTO
   ): Promise<TrainingGroupUserResponseDTO> {
      return apiRequest<
         TrainingGroupUserResponseDTO,
         AddMemberByEmailRequestDTO
      >({
         method: "post",
         path: `/grupos-de-treinamento/usuarios/adicionar`,
         data: payload,
      });
   },

   /**
    * Remove um usuário do grupo de treinamento
    */
   removeUserFromTrainingGroup(groupId: string, userId: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/grupos-de-treinamento/usuarios/${groupId}/usuario/${userId}/remover`,
      });
   },

   /**
    * Obtém um usuário específico em um grupo de treinamento
    */
   getTrainingGroupUser(
      groupId: string,
      userId: string
   ): Promise<TrainingGroupUserResponseDTO> {
      return apiRequest<TrainingGroupUserResponseDTO>({
         method: "get",
         path: `/grupos-de-treinamento/usuarios/${groupId}/usuario/${userId}`,
      });
   },

   /**
    * Obtém todos os registros de usuários em grupos de treinamento
    */
   getAllTrainingGroupUser(): Promise<TrainingGroupUserResponseDTO[]> {
      return apiRequest<TrainingGroupUserResponseDTO[]>({
         method: "get",
         path: `/grupos-de-treinamento/usuarios`,
      });
   },

   /**
    * Obtém todos os usuários de um grupo de treinamento pelo ID do grupo
    */
   getAllUsersByTrainingGroupId(
      groupId: string
   ): Promise<TrainingGroupUserResponseDTO[]> {
      return apiRequest<TrainingGroupUserResponseDTO[]>({
         method: "get",
         path: `/grupos-de-treinamento/usuarios/grupo/${groupId}`,
      });
   },

   /**
    * Obtém todos os grupos de treinamento de um usuário pelo ID do usuário
    */
   getAllTrainingGroupsByUserId(
      userId: string
   ): Promise<TrainingGroupResponseDTO[]> {
      return apiRequest<TrainingGroupResponseDTO[]>({
         method: "get",
         path: `/grupos-de-treinamento/usuarios/usuario/${userId}`,
      });
   },

   /**
    * Obtém o ranking de usuários por grupo de treinamento
    */
   getRankByTrainingGroupId(
      groupId: string
   ): Promise<TrainingGroupUserResponseDTO[]> {
      return apiRequest<TrainingGroupUserResponseDTO[]>({
         method: "get",
         path: `/grupos-de-treinamento/usuarios/rank/${groupId}`,
      });
   },

   /**
    * Define um usuário como admin no grupo de treinamento
    */
   setUserAsAdmin(
      groupId: string,
      userId: string
   ): Promise<TrainingGroupUserResponseDTO> {
      return apiRequest<TrainingGroupUserResponseDTO>({
         method: "patch",
         path: `/grupos-de-treinamento/usuarios/${groupId}/usuario/${userId}/admin`,
      });
   },

   /**
    * Remove o status de admin de um usuário no grupo de treinamento
    */
   removeUserAsAdmin(
      groupId: string,
      userId: string
   ): Promise<TrainingGroupUserResponseDTO> {
      return apiRequest<TrainingGroupUserResponseDTO>({
         method: "patch",
         path: `/grupos-de-treinamento/usuarios/${groupId}/usuario/${userId}/admin/remover`,
      });
   },
};
