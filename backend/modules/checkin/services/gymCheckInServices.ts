import type { GymCheckInResponseDTO } from "@/backend/modules/checkin/types/gymCheckInTypes";
import type {
   FilterGymCheckInRequestDTO,
   GymCheckInAndCheckOutRequestDTO,
} from "@/backend/modules/checkin/schemas/gymCheckInSchemas";
import { apiRequest } from "@/backend/api";

/**
 * Service para chamadas à API de Gym Check-In/Check-Out
 */
export const gymCheckInService = {
   /**
    * Registra check-in na academia
    */
   doCheckIn(
      payload: GymCheckInAndCheckOutRequestDTO
   ): Promise<GymCheckInResponseDTO> {
      return apiRequest<GymCheckInResponseDTO, GymCheckInAndCheckOutRequestDTO>(
         {
            method: "post",
            path: `/gym-check-in`,
            data: payload,
         }
      );
   },

   /**
    * Registra check-out na academia
    */
   doCheckOut(
      payload: GymCheckInAndCheckOutRequestDTO
   ): Promise<GymCheckInResponseDTO> {
      return apiRequest<GymCheckInResponseDTO, GymCheckInAndCheckOutRequestDTO>(
         {
            method: "patch",
            path: `/gym-check-in/check-out`,
            data: payload,
         }
      );
   },

   /**
    * Busca todos os check-ins/outs de um usuário
    */
   getAllByUserId(userId: string): Promise<GymCheckInResponseDTO[]> {
      return apiRequest<GymCheckInResponseDTO[]>({
         method: "get",
         path: `/gym-check-in/user/${userId}`,
      });
   },

   /**
    * Verifica se um usuário tem um check-in aberto
    */
   hasOpenCheckInByUserId(userId: string): Promise<boolean> {
      return apiRequest<GymCheckInResponseDTO[]>({
         method: "get",
         path: `/gym-check-in/open/${userId}`,
      });
   },

   /**
    * Filtra check-ins/outs por intervalo de datas e por ID do usuário
    */
   filterByUserIdAndDate(
      payload: FilterGymCheckInRequestDTO
   ): Promise<GymCheckInResponseDTO[]> {
      return apiRequest<GymCheckInResponseDTO[], FilterGymCheckInRequestDTO>({
         method: "post",
         path: `/gym-check-in/filter`,
         data: payload,
      });
   },
};
