import { apiRequest } from "@/lib/apiRequest";
import { UserResponseDTO } from "./userService";

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
