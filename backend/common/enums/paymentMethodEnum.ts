export enum PaymentMethod {
   CREDIT_CARD = "CREDIT_CARD",
   DEBIT_CARD = "DEBIT_CARD",
   PIX = "PIX"
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
   [PaymentMethod.CREDIT_CARD]: "Cartão de crédito",
   [PaymentMethod.PIX]: "PIX",
   [PaymentMethod.DEBIT_CARD]: "Cartão de dédito",
};
