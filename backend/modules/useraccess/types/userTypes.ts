import { RoleType } from "@/backend/common/enums/rolesEnum";

export interface UserResponseDTO {
   id: string;
   email: string;
   roles: RoleType[];
}
