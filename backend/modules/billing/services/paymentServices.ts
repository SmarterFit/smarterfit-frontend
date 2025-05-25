import { apiRequest } from "@/backend/api";
import {
   CreatePaymentRequestDTO,
   SearchPaymentRequestDTO,
   ProcessorPaymentRequestDTO,
} from "../schemas/paymentSchemas";
import {
   PaymentResponseDTO,
   PaymentWithSubscriptionResponseDTO,
   PaymentProcessorResponseDTO,
} from "../types/paymentTypes";

export const paymentService = {
   /**
    * Cria um novo pagamento
    */
   createPayment(
      payload: CreatePaymentRequestDTO
   ): Promise<PaymentResponseDTO> {
      return apiRequest<PaymentResponseDTO, CreatePaymentRequestDTO>({
         method: "post",
         path: `/pagamentos`,
         data: payload,
      });
   },

   /**
    * Busca um pagamento pelo ID
    */
   getPaymentById(id: string): Promise<PaymentResponseDTO> {
      return apiRequest<PaymentResponseDTO>({
         method: "get",
         path: `/pagamentos/${id}`,
      });
   },

   /**
    * Busca todos os pagamentos
    */
   getAll(): Promise<PaymentResponseDTO[]> {
      return apiRequest<PaymentResponseDTO[]>({
         method: "get",
         path: `/pagamentos`,
      });
   },

   /**
    * Busca todos os pagamentos por ID do dono da assinatura
    */
   getAllBySubscriptionOwnerId(
      subscriptionOwnerId: string
   ): Promise<PaymentWithSubscriptionResponseDTO[]> {
      return apiRequest<PaymentWithSubscriptionResponseDTO[]>({
         method: "get",
         path: `/pagamentos/usuario/${subscriptionOwnerId}`,
      });
   },

   /**
    * Busca pagamentos com filtros (com paginação)
    */
   searchPayments(
      payload: SearchPaymentRequestDTO,
      page?: number,
      size?: number
   ): Promise<{
      content: PaymentResponseDTO[];
      totalElements: number;
      totalPages: number;
      number: number;
   }> {
      return apiRequest<{
         content: PaymentResponseDTO[];
         totalElements: number;
         totalPages: number;
         number: number;
      }>({
         method: "get",
         path: `/pagamentos/buscar`,
         params: {
            ...payload,
            page,
            size,
         },
      });
   },

   /**
    * Processa pagamento pelo ID
    */
   processPayment(
      id: string,
      payload: ProcessorPaymentRequestDTO
   ): Promise<PaymentProcessorResponseDTO> {
      return apiRequest<
         PaymentProcessorResponseDTO,
         ProcessorPaymentRequestDTO
      >({
         method: "patch",
         path: `/pagamentos/${id}/processar`,
         data: payload,
      });
   },

   /**
    * Cancela pagamento pelo ID
    */
   cancelPayment(id: string): Promise<void> {
      return apiRequest<void>({
         method: "patch",
         path: `/pagamentos/${id}/cancelar`,
      });
   },
};
