import { apiRequest } from "@/lib/apiRequest";
import { ModalityResponseDTO } from "./modalityService";

export type ClassGroupResponseDTO = {
   id: string;
   title: string;
   capacity: number;
   totalMembers: number;
   description: string;
   modalityDTO: ModalityResponseDTO;
   startDate: Date;
   endDate: Date;
   nameCreator: string;
};

export async function fetchClassGroups(): Promise<ClassGroupResponseDTO[]> {
   const response = await apiRequest<ClassGroupResponseDTO[]>("GET", "/turma");

   return response;
}
