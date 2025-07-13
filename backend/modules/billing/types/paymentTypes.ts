import { PaymentStatus } from "@/backend/common/enums/paymentStatusEnum";
import { SubscriptionResponseDTO } from "./subscriptionTypes"; // ajuste o caminho conforme necessário
import { PaymentMethodResponseDTO } from "@/backend/framework/billing/types/paymentMethodTypes";

export interface PaymentProcessorResponseDTO {
   message: string;
   success: boolean;
}

export interface PaymentResponseDTO {
   id: string; // UUID representado como string
   amount: number;
   paymentDate: string; // ISO datetime string
   expirationIn: string; // ISO datetime string
   method: PaymentMethodResponseDTO;
   status: PaymentStatus;
}

export interface PaymentWithSubscriptionResponseDTO {
   id: string; // UUID
   subscription: SubscriptionResponseDTO;
   amount: number;
   paymentDate: string; // ISO datetime string
   expirationIn: string; // ISO datetime string
   method: PaymentMethodResponseDTO;
   status: PaymentStatus;
}
