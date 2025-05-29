import { UserResponseDTO } from "../../useraccess/types/userTypes";

export interface TrainingGroupUserResponseDTO {
   user: UserResponseDTO;
   isAdmin: boolean;
   points: number;
}
