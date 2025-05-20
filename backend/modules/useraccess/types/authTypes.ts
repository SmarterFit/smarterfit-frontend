import { JwtToken } from "@/backend/common/types/jwtTypes";
import { ProfileResponseDTO } from "./profileTypes";

export interface AuthResponseDTO {
   accessToken: JwtToken;
   profile: ProfileResponseDTO;
}
