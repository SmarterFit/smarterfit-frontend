export enum PaymentStatus {
   PAID = "PAID",
   PENDING = "PENDING",
   EXPIRED = "EXPIRED",
   FAILED = "FAILED",
   CANCELED = "CANCELED",
}

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
   [PaymentStatus.PAID]: "Pago",
   [PaymentStatus.PENDING]: "Pendente",
   [PaymentStatus.EXPIRED]: "Expirado",
   [PaymentStatus.FAILED]: "Falhou",
   [PaymentStatus.CANCELED]: "Cancelado",
};
