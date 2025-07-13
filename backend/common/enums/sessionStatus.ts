// frontend/src/backend/common/enums/sessionStatus.ts
export enum SessionStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED", 
  CANCELLED = "CANCELLED"
}

export const SessionStatusLabels: Record<SessionStatus, string> = {
  [SessionStatus.SCHEDULED]: "Agendada",
  [SessionStatus.CONFIRMED]: "Confirmada",
  [SessionStatus.CANCELLED]: "Cancelada"
};