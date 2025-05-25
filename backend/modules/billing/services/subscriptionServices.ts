import { apiRequest } from "@/backend/api";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";
import {
   CreateSubscriptionRequestDTO,
   SearchSubscriptionRequestDTO,
   SubscriptionStatusCountRequestDTO,
} from "../schemas/subscriptionSchemas";
import {
   SubscriptionResponseDTO,
   SubscriptionStatusCountResponseDTO,
} from "../types/subscriptionTypes";

export const subscriptionService = {
   /**
    * Cria uma nova assinatura (usuário comum e funcionários)
    */
   create(
      payload: CreateSubscriptionRequestDTO
   ): Promise<SubscriptionResponseDTO> {
      return apiRequest<SubscriptionResponseDTO, CreateSubscriptionRequestDTO>({
         method: "post",
         path: `/assinaturas`,
         data: payload,
      });
   },

   /**
    * Busca assinatura pelo ID (usuário dono e funcionários)
    */
   getById(id: string): Promise<SubscriptionResponseDTO> {
      return apiRequest<SubscriptionResponseDTO>({
         method: "get",
         path: `/assinaturas/${id}`,
      });
   },

   /**
    * Busca todas as assinaturas (funcionários)
    */
   getAll(): Promise<SubscriptionResponseDTO[]> {
      return apiRequest<SubscriptionResponseDTO[]>({
         method: "get",
         path: `/assinaturas`,
      });
   },

   /**
    * Busca todas as assinaturas por dono da assinatura (usuário dono e funcionários)
    */
   getAllByOwnerId(
      subscriptionOwnerId: string
   ): Promise<SubscriptionResponseDTO[]> {
      return apiRequest<SubscriptionResponseDTO[]>({
         method: "get",
         path: `/assinaturas/usuario/${subscriptionOwnerId}`,
      });
   },

   /**
    * Busca assinaturas com filtros e paginação (usuário dono e funcionários)
    */
   search(
      filters: SearchSubscriptionRequestDTO,
      page?: number,
      size?: number
   ): Promise<PageResponseDTO<SubscriptionResponseDTO>> {
      return apiRequest<
         PageResponseDTO<SubscriptionResponseDTO>,
         SearchSubscriptionRequestDTO
      >({
         method: "get",
         path: `/assinaturas/buscar`,
         params: {
            ...filters,
            page,
            size,
         },
      });
   },

   /**
    * Verifica se um participante possui assinatura atual
    */
   existsCurrentByParticipantId(participantId: string): Promise<boolean> {
      return apiRequest<boolean>({
         method: "get",
         path: `/assinaturas/possui-assinatura/${participantId}`,
      });
   },

   /**
    * Cancela uma assinatura pelo ID (usuário dono e funcionários)
    */
   cancel(id: string): Promise<void> {
      return apiRequest<void>({
         method: "patch",
         path: `/assinaturas/${id}/cancelar`,
      });
   },

   /**
    * Busca assinaturas disponíveis por turma e usuário (usuário dono e funcionários)
    */
   getAvailableByClassGroupAndUser(
      classGroupId: string,
      userId: string
   ): Promise<SubscriptionResponseDTO[]> {
      return apiRequest<SubscriptionResponseDTO[]>({
         method: "get",
         path: `/assinaturas/turma/${classGroupId}/usuario/${userId}`,
      });
   },

   /**
    * Retorna contagem de assinaturas por status (POST)
    */
   getStatusCounts(
      payload: SubscriptionStatusCountRequestDTO
   ): Promise<SubscriptionStatusCountResponseDTO> {
      return apiRequest<
         SubscriptionStatusCountResponseDTO,
         SubscriptionStatusCountRequestDTO
      >({
         method: "post",
         path: `/assinaturas/contagem-por-status`,
         data: payload,
      });
   },
};
