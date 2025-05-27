import { ClassCheckInRequestDTO } from "./../schemas/classCheckInSchemas";
import type { ClassCheckInResponseDTO } from "@/backend/modules/checkin/types/classCheckInTypes";
import { apiRequest } from "@/backend/api";

/**
 * Service para chamadas à API de Class Check-In
 */
export const classCheckInService = {
   /**
    * Cria um novo registro de check-in em aula
    */
   createClassCheckIn(
      payload: ClassCheckInRequestDTO
   ): Promise<ClassCheckInResponseDTO> {
      return apiRequest<ClassCheckInResponseDTO, ClassCheckInRequestDTO>({
         method: "post",
         path: `/class-check-in`,
         data: payload,
      });
   },

   /**
    * Atualiza um registro de check-in em aula (ex.: mudança de status)
    */
   updateClassCheckIn(
      payload: ClassCheckInRequestDTO
   ): Promise<ClassCheckInResponseDTO> {
      return apiRequest<ClassCheckInResponseDTO, ClassCheckInRequestDTO>({
         method: "patch",
         path: `/class-check-in`,
         data: payload,
      });
   },

   /**
    * Busca todos os check-ins de aula de um usuário
    */
   getAllByUserId(userId: string): Promise<ClassCheckInResponseDTO[]> {
      return apiRequest<ClassCheckInResponseDTO[]>({
         method: "get",
         path: `/class-check-in/user/${userId}`,
      });
   },

   /**
    * Busca todos os check-ins de uma sessão de aula
    */
   getAllByClassSessionId(
      classSessionId: string
   ): Promise<ClassCheckInResponseDTO[]> {
      return apiRequest<ClassCheckInResponseDTO[]>({
         method: "get",
         path: `/class-check-in/class-session/${classSessionId}`,
      });
   },
};
