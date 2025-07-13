import { Gender } from "@/backend/common/enums/genderEnum";
import { AddressResponseDTO } from "./addressTypes";

export interface ProfileResponseDTO {
   id: string; // UUID
   fullName: string;
   cpf: string;
   phone: string;
   birthDate: string;
   gender: Gender;
   address: AddressResponseDTO;
}
