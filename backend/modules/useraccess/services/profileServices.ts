import type { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";
import type {
   UpdateProfileRequestDTO,
   SearchProfileRequestDTO,
} from "@/backend/modules/useraccess/schemas/profileSchemas";
import { apiRequest } from "@/backend/api";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";

export const profileService = {
   /**
    * Busca um perfil pelo ID
    */
   getById(id: string): Promise<ProfileResponseDTO> {
      return apiRequest<ProfileResponseDTO>({
         method: "get",
         path: `/perfis/${id}`,
      });
   },

   /**
    * Pesquisa perfis com filtros e paginação
    */
   search(
      filters: SearchProfileRequestDTO,
      page?: number,
      size?: number
   ): Promise<PageResponseDTO<ProfileResponseDTO>> {
      return apiRequest<
         PageResponseDTO<ProfileResponseDTO>,
         SearchProfileRequestDTO
      >({
         method: "get",
         path: `/perfis/buscar`,
         params: {
            ...filters,
            page,
            size,
         },
      });
   },

   /**
    * Atualiza um perfil existente
    */
   updateById(
      id: string,
      payload: UpdateProfileRequestDTO
   ): Promise<ProfileResponseDTO> {
      return apiRequest<ProfileResponseDTO, UpdateProfileRequestDTO>({
         method: "put",
         path: `/perfis/${id}`,
         data: payload,
      });
   },
};
