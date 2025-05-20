import { Gender } from "@/backend/common/enums/genderEnums";
import { AddressResponseDTO } from "./addressTypes";
import { UserResponseDTO } from "./userTypes";

export interface ProfileResponseDTO {
   id: string; // UUID
   fullName: string;
   cpf: string;
   phone: string;
   birthDate: string;
   gender: Gender;
   address: AddressResponseDTO;
   user: UserResponseDTO;
}
