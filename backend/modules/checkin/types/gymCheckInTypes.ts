import { UserResponseDTO } from "../../useraccess/types/userTypes";

export interface GymCheckInResponseDTO {
   id: string; // UUID
   user: UserResponseDTO;
   checkInTime: string; // ISO datetime
   checkOutTime: string; // ISO datetime
}
