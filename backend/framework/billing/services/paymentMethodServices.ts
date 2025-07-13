import { apiRequest } from "@/backend/api";
import { PaymentMethodResponseDTO } from "../types/paymentMethodTypes";

export const paymentMethodService = {
   /**
    * Busca todos os métodos de pagamento que estão habilitados.
    */
   getEnabledPaymentMethods(): Promise<PaymentMethodResponseDTO[]> {
      return apiRequest<PaymentMethodResponseDTO[]>({
         method: "get",
         path: `/pagamentos/metodos`,
      });
   },

   /**
    * Habilita um método de pagamento pelo seu ID.
    * @param id O ID do método de pagamento a ser habilitado.
    */
   enablePaymentMethod(id: string): Promise<PaymentMethodResponseDTO> {
      return apiRequest<PaymentMethodResponseDTO>({
         method: "patch",
         path: `/pagamentos/metodos/${id}/ativar`,
      });
   },

   /**
    * Desabilita um método de pagamento pelo seu ID.
    * @param id O ID do método de pagamento a ser desabilitado.
    */
   disablePaymentMethod(id: string): Promise<PaymentMethodResponseDTO> {
      return apiRequest<PaymentMethodResponseDTO>({
         method: "patch",
         path: `/pagamentos/metodos/${id}/desativar`,
      });
   },
};
