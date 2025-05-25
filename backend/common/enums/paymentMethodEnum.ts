export enum PaymentMethod {
   CARD = "CARD",
   PIX = "PIX",
   CASH = "CASH",
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
   [PaymentMethod.CARD]: "Cartão de crédito",
   [PaymentMethod.PIX]: "PIX",
   [PaymentMethod.CASH]: "Dinheiro",
};
