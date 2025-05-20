import { apiRequest } from "@/backend/api";
import { LoginRequestDTO } from "../schemas/authSchemas";
import { AuthResponseDTO } from "../types/authTypes";

export const authService = {
   /**
    * Faz login de um usuário
    */
   login(payload: LoginRequestDTO): Promise<AuthResponseDTO> {
      return apiRequest<AuthResponseDTO, LoginRequestDTO>({
         method: "post",
         path: "/auth/login",
         data: payload,
      });
   },
};
