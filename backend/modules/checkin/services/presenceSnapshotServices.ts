import type { PresenceSnapshotResponseDTO } from "@/backend/modules/checkin/types/presenceSnapshotTypes";
import type { FilterPresenceSnapshotRequestDTO } from "@/backend/modules/checkin/schemas/presenceSnapshotSchemas";
import { apiRequest } from "@/backend/api";

/**
 * Service para chamadas à API de Presence Snapshot
 */
export const presenceSnapshotService = {
   /**
    * Reinicia as contagens de presença
    */
   resetPresence(): Promise<void> {
      return apiRequest<void>({
         method: "post",
         path: `/presence-snapshots/reset`,
      });
   },

   /**
    * Busca todas as snapshots de presença
    */
   getAll(): Promise<PresenceSnapshotResponseDTO[]> {
      return apiRequest<PresenceSnapshotResponseDTO[]>({
         method: "get",
         path: `/presence-snapshots`,
      });
   },

   /**
    * Busca a última snapshot registrada
    */
   getLast(): Promise<PresenceSnapshotResponseDTO> {
      return apiRequest<PresenceSnapshotResponseDTO>({
         method: "get",
         path: `/presence-snapshots/latest`,
      });
   },

   /**
    * Filtra snapshots por intervalo de datas
    */
   filterByDate(
      payload: FilterPresenceSnapshotRequestDTO
   ): Promise<PresenceSnapshotResponseDTO[]> {
      return apiRequest<
         PresenceSnapshotResponseDTO[],
         FilterPresenceSnapshotRequestDTO
      >({
         method: "post",
         path: `/presence-snapshots/date-range`,
         data: payload,
      });
   },
};
