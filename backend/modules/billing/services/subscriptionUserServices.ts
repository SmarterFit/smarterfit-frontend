import { apiRequest } from "@/backend/api";
import { UserResponseDTO } from "../../useraccess/types/userTypes";
import { AddMemberByEmailRequestDTO } from "../schemas/subscriptionUserSchemas";
import { SubscriptionResponseDTO } from "../types/subscriptionTypes";
import { SubscriptionUserResponseDTO } from "../types/subscriptionUserTypes";

export const subscriptionUserService = {
   /**
    * Adiciona membro à assinatura pelo subscriptionId e userId
    */
   addMember(
      subscriptionId: string,
      userId: string
   ): Promise<SubscriptionUserResponseDTO> {
      return apiRequest<SubscriptionUserResponseDTO>({
         method: "post",
         path: `/assinaturas/usuarios/${subscriptionId}/usuario/${userId}/adicionar`,
      });
   },

   /**
    * Adiciona membro à assinatura pelo email
    */
   addMemberByEmail(
      payload: AddMemberByEmailRequestDTO
   ): Promise<SubscriptionUserResponseDTO> {
      return apiRequest<
         SubscriptionUserResponseDTO,
         AddMemberByEmailRequestDTO
      >({
         method: "post",
         path: `/assinaturas/usuarios/adicionar`,
         data: payload,
      });
   },

   /**
    * Remove membro da assinatura
    */
   removeMember(
      subscriptionId: string,
      userId: string
   ): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/assinaturas/usuarios/${subscriptionId}/usuario/${userId}/remover`,
      });
   },

   /**
    * Busca membro específico da assinatura
    */
   getById(
      subscriptionId: string,
      userId: string
   ): Promise<SubscriptionUserResponseDTO> {
      return apiRequest<SubscriptionUserResponseDTO>({
         method: "get",
         path: `/assinaturas/usuarios/${subscriptionId}/usuario/${userId}`,
      });
   },

   /**
    * Busca todos os membros das assinaturas (acesso funcionários)
    */
   getAll(): Promise<SubscriptionUserResponseDTO[]> {
      return apiRequest<SubscriptionUserResponseDTO[]>({
         method: "get",
         path: `/assinaturas/usuarios`,
      });
   },

   /**
    * Busca todos os usuários participantes de uma assinatura
    */
   getAllUsersBySubscriptionId(
      subscriptionId: string
   ): Promise<UserResponseDTO[]> {
      return apiRequest<UserResponseDTO[]>({
         method: "get",
         path: `/assinaturas/usuarios/assinatura/${subscriptionId}`,
      });
   },

   /**
    * Busca todas as assinaturas de um usuário
    */
   getAllSubscriptionsByUserId(
      userId: string
   ): Promise<SubscriptionResponseDTO[]> {
      return apiRequest<SubscriptionResponseDTO[]>({
         method: "get",
         path: `/assinaturas/usuarios/usuario/${userId}`,
      });
   },
};
