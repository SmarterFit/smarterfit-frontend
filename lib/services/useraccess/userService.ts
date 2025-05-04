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

export type LoginUserData = {
   email: string;
   password: string;
};

export type JwtToken = {
   token: string;
   type: string;
};

export type AuthResponseDTO = {
   accessToken: JwtToken;
   user: UserResponseDTO;
};

export async function loginUser(data: LoginUserData): Promise<AuthResponseDTO> {
   return await apiRequest<AuthResponseDTO>("POST", "/auth/login", data);
}
