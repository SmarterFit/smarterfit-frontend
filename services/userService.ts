// services/userService.ts
import { apiRequest } from "@/lib/apiRequest";

export type RegisterUserData = {
   name: string;
   email: string;
   cpf: string;
   password: string;
   confirmPassword: string;
   roles: string[];
};

export type UserResponseDTO = {
   id: string;
   email: string;
   roles: string[];
};

export async function registerUser(
   data: RegisterUserData
): Promise<UserResponseDTO> {
   return await apiRequest<UserResponseDTO>(
      "POST",
      "/usuarios/cadastrar",
      data
   );
}
