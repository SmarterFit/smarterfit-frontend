import type { AddressResponseDTO } from "@/backend/modules/useraccess/types/addressTypes";
import type { CreateAddressRequestDTO } from "@/backend/modules/useraccess/schemas/addressSchemas";
import { apiRequest } from "@/backend/api";

/**
 * Service para chamadas à API de endereços
 */
export const addressService = {
   /**
    * Cria um novo endereço para um perfil
    */
   create(
      profileId: string,
      payload: CreateAddressRequestDTO
   ): Promise<AddressResponseDTO> {
      return apiRequest<AddressResponseDTO, CreateAddressRequestDTO>({
         method: "post",
         path: `/enderecos/${profileId}`,
         data: payload,
      });
   },

   /**
    * Busca o endereço de um perfil pelo ID
    */
   getByProfileId(profileId: string): Promise<AddressResponseDTO> {
      return apiRequest<AddressResponseDTO>({
         method: "get",
         path: `/enderecos/${profileId}`,
      });
   },

   /**
    * Atualiza o endereço de um perfil pelo ID
    */
   updateByProfileId(
      profileId: string,
      payload: CreateAddressRequestDTO
   ): Promise<AddressResponseDTO> {
      return apiRequest<AddressResponseDTO, CreateAddressRequestDTO>({
         method: "put",
         path: `/enderecos/${profileId}`,
         data: payload,
      });
   },
};
