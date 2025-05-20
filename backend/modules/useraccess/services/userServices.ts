import type { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import type {
   CreateUserRequestDTO,
   UpdateUserEmailRequestDTO,
   UpdateUserPasswordRequestDTO,
   UpdateUserRolesRequestDTO,
} from "@/backend/modules/useraccess/schemas/userSchemas";
import { apiRequest } from "@/backend/api";

export const userService = {
   /**
    * Cria um novo usuário
    */
   create(payload: CreateUserRequestDTO): Promise<UserResponseDTO> {
      return apiRequest<UserResponseDTO, CreateUserRequestDTO>({
         method: "post",
         path: "/usuarios/cadastrar",
         data: payload,
      });
   },

   /**
    * Retorna um usuário pelo ID
    */
   getById(id: string): Promise<UserResponseDTO> {
      return apiRequest<UserResponseDTO>({
         method: "get",
         path: `/usuarios/${id}`,
      });
   },

   /**
    * Atualiza o e-mail de um usuário
    */
   updateEmailById(
      id: string,
      payload: UpdateUserEmailRequestDTO
   ): Promise<UserResponseDTO> {
      return apiRequest<UserResponseDTO, UpdateUserEmailRequestDTO>({
         method: "patch",
         path: `/usuarios/${id}/email`,
         data: payload,
      });
   },

   /**
    * Atualiza a senha de um usuário
    */
   updatePasswordById(
      id: string,
      payload: UpdateUserPasswordRequestDTO
   ): Promise<UserResponseDTO> {
      return apiRequest<UserResponseDTO, UpdateUserPasswordRequestDTO>({
         method: "patch",
         path: `/usuarios/${id}/senha`,
         data: payload,
      });
   },

   /**
    * Atualiza os cargos de um usuário
    */
   updateRolesById(
      id: string,
      payload: UpdateUserRolesRequestDTO
   ): Promise<UserResponseDTO> {
      return apiRequest<UserResponseDTO, UpdateUserRolesRequestDTO>({
         method: "patch",
         path: `/usuarios/${id}/cargos`,
         data: payload,
      });
   },

   /**
    * Remove um usuário
    */
   delete(id: string): Promise<void> {
      return apiRequest<void>({
         method: "delete",
         path: `/usuarios/${id}`,
      });
   },
};
