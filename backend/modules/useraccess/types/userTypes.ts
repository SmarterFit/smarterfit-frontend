import { RoleType } from "@/backend/common/enums/rolesEnum";
import { ProfileResponseDTO } from "./profileTypes";

export interface UserResponseDTO {
   id: string;
   email: string;
   roles: RoleType[];
   profile: ProfileResponseDTO;
}
