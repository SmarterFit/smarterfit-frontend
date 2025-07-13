export enum SessionStatus {
   SCHEDULED = "SCHEDULED",
   CONFIRMED = "CONFIRMED",
   CANCELLED = "CANCELLED",
}

export const SessionStatusLabels: Record<SessionStatus, string> = {
   [SessionStatus.SCHEDULED]: "Agendado",
   [SessionStatus.CONFIRMED]: "Confirmado",
   [SessionStatus.CANCELLED]: "Cancelado",
};
