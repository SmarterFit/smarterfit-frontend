import { z } from "zod";
import { PaymentMethod } from "@/backend/common/enums/paymentMethodEnum";
import { PaymentStatus } from "@/backend/common/enums/paymentStatusEnum";

// CreatePaymentRequestDTO
export const createPaymentRequestSchema = z.object({
   subscriptionId: z
      .string({ required_error: "O ID da assinatura não pode ser nulo" })
      .uuid({ message: "O ID da assinatura deve ser um UUID válido" }),
   method: z.nativeEnum(PaymentMethod, {
      required_error: "O método de pagamento não pode ser nulo",
      invalid_type_error:
         "O método de pagamento deve ser um dos valores válidos de PaymentMethod",
   }),
});

export type CreatePaymentRequestDTO = z.infer<
   typeof createPaymentRequestSchema
>;

// ProcessorPaymentRequestDTO (sem atributos)
export const processorPaymentRequestSchema = z.object({});

export type ProcessorPaymentRequestDTO = z.infer<
   typeof processorPaymentRequestSchema
>;

// SearchPaymentRequestDTO
export const searchPaymentRequestSchema = z.object({
   subscriptionId: z
      .string()
      .uuid({ message: "O ID da assinatura deve ser um UUID válido" })
      .optional(),
   subscriptionOwnerId: z
      .string()
      .uuid({
         message: "O ID do proprietário da assinatura deve ser um UUID válido",
      })
      .optional(),
   methods: z
      .array(
         z.nativeEnum(PaymentMethod, {
            invalid_type_error:
               "O método de pagamento deve ser um dos valores válidos de PaymentMethod",
         })
      )
      .optional(),
   status: z
      .array(
         z.nativeEnum(PaymentStatus, {
            invalid_type_error:
               "O status de pagamento deve ser um dos valores válidos de PaymentStatus",
         })
      )
      .optional(),
});

export type SearchPaymentRequestDTO = z.infer<
   typeof searchPaymentRequestSchema
>;
