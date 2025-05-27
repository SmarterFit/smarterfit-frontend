export enum SubscriptionStatus {
   PENDING = "PENDING",
   ACTIVE = "ACTIVE",
   EXPIRED = "EXPIRED",
   CANCELED = "CANCELED",
}

export const SubscriptionStatusLabels: Record<SubscriptionStatus, string> = {
   [SubscriptionStatus.PENDING]: "Pendente",
   [SubscriptionStatus.ACTIVE]: "Ativa",
   [SubscriptionStatus.EXPIRED]: "Expirada",
   [SubscriptionStatus.CANCELED]: "Cancelada",
};
