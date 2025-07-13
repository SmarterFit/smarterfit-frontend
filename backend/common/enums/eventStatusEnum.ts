export enum EventStatus {
   CONFIRMED = "CONFIRMED",
   CANCELED = "CANCELED",
   TERMINATED = "TERMINATED",
}

export const EventStatusLabels: Record<EventStatus, string> = {
   [EventStatus.CONFIRMED]: "Confirmado",
   [EventStatus.CANCELED]: "Cancelado",
   [EventStatus.TERMINATED]: "Finalizado",
};
