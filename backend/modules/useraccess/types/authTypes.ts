import { JwtToken } from "@/backend/common/types/jwtTypes";
import { UserResponseDTO } from "./userTypes";

export interface AuthResponseDTO {
   accessToken: JwtToken;
   user: UserResponseDTO;
}
