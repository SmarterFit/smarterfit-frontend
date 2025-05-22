import { CheckInStatus } from "@/backend/common/enums/checkInStatusEnum";
import { UserResponseDTO } from "../../useraccess/types/userTypes";

export interface ClassCheckInResponseDTO {
   user: UserResponseDTO;
   ///classSession: ClassSessionResponseDTO;
   checkInTime: string; // ISO datetime
   status: CheckInStatus;
}
