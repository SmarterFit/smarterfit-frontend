// import type { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
// import type { CreateProfileMetricRequestDTO } from "@/backend/modules/useraccess/schemas/profileMetricSchemas";
// import { apiRequest } from "@/backend/api";
// import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";

// /**
//  * Serviço para chamadas à API de métricas de perfil
//  */
// export const profileMetricService = {
//    /**
//     * Cria uma nova métrica para o perfil
//     */
//    create(
//       profileId: string,
//       payload: CreateProfileMetricRequestDTO
//    ): Promise<ProfileMetricResponseDTO> {
//       return apiRequest<
//          ProfileMetricResponseDTO,
//          CreateProfileMetricRequestDTO
//       >({
//          method: "post",
//          path: `/perfis/${profileId}/metricas`,
//          data: payload,
//       });
//    },

//    /**
//     * Retorna as últimas métricas do perfil
//     */
//    getLasts(profileId: string): Promise<ProfileMetricResponseDTO[]> {
//       return apiRequest<ProfileMetricResponseDTO[]>({
//          method: "get",
//          path: `/perfis/${profileId}/metricas/ultimas`,
//       });
//    },

//    /**
//     * Retorna todas as métricas do perfil
//     */
//    getAll(profileId: string): Promise<ProfileMetricResponseDTO[]> {
//       return apiRequest<ProfileMetricResponseDTO[]>({
//          method: "get",
//          path: `/perfis/${profileId}/metricas`,
//       });
//    },

//    /**
//     * Retorna métricas do perfil por tipo
//     */
//    getByType(
//       profileId: string,
//       type: ProfileMetricType
//    ): Promise<ProfileMetricResponseDTO[]> {
//       return apiRequest<ProfileMetricResponseDTO[]>({
//          method: "get",
//          path: `/perfis/${profileId}/metricas/tipo/${type}`,
//       });
//    },
// };
