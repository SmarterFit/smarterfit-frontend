import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { paymentService } from "@/backend/modules/billing/services/paymentServices";
import { Button } from "@/components/ui/button";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogFooter,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogCancel,
   AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { PaymentResponseDTO } from "@/backend/modules/billing/types/paymentTypes";
import {
   CreatePaymentRequestDTO,
   createPaymentRequestSchema,
} from "@/backend/modules/billing/schemas/paymentSchemas";
import {
   PaymentMethod,
   PaymentMethodLabels,
} from "@/backend/common/enums/paymentMethodEnum";
import {
   PaymentStatus,
   PaymentStatusLabels,
} from "@/backend/common/enums/paymentStatusEnum";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../ui/form";

import {
   Table,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from "../ui/table";

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../ui/select";

// Importante: processorPaymentRequestSchema está vazio, só para tipagem
import { processorPaymentRequestSchema } from "@/backend/modules/billing/schemas/paymentSchemas";

export function PaymentsTabContent({
   subscriptionId,
   endedIn,
   isOwnerLogged,
}: {
   subscriptionId: string;
   endedIn: string | null | undefined;
   isOwnerLogged: boolean;
}) {
   const [payments, setPayments] = useState<PaymentResponseDTO[]>([]);
   const [loading, setLoading] = useState(false);
   const [openDialog, setOpenDialog] = useState(false);
   const [hasPendingPayment, setHasPendingPayment] = useState(false);
   const [loadingAddMember, setLoadingAddMember] = useState(false);

   // Estado para controlar dialog de processar pagamento
   const [processingDialogOpen, setProcessingDialogOpen] = useState(false);
   const [processingPaymentId, setProcessingPaymentId] = useState<
      string | null
   >(null);
   const [processingLoading, setProcessingLoading] = useState(false);

   const form = useForm<CreatePaymentRequestDTO>({
      resolver: zodResolver(createPaymentRequestSchema),
      defaultValues: {
         subscriptionId,
         method: PaymentMethod.CARD,
      },
   });

   // Buscar pagamentos da assinatura
   const fetchPayments = async () => {
      setLoading(true);
      try {
         const response = await paymentService.getAllBySubscriptionId(
            subscriptionId
         );
         setPayments(response);
         const pending = response.some(
            (p) => p.status === PaymentStatus.PENDING
         );
         setHasPendingPayment(pending);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchPayments();
   }, [subscriptionId]);

   // Checa se a data de finalização está nos últimos 7 dias
   const endedDate = endedIn ? new Date(endedIn) : null;
   const now = new Date();
   const isEndedRecent = endedDate
      ? now.getTime() - endedDate.getTime() <= 7 * 24 * 60 * 60 * 1000
      : true;

   const onSubmit = async (data: CreatePaymentRequestDTO) => {
      setLoadingAddMember(true);
      try {
         await paymentService.create(data);
         SuccessToast(
            "Pagamento criado com sucesso.",
            "Realize o seu pagamento!"
         );
         setOpenDialog(false);
         form.reset();
         fetchPayments();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoadingAddMember(false);
      }
   };

   // Função para processar pagamento
   const handleProcessPayment = async () => {
      if (!processingPaymentId) return;

      setProcessingLoading(true);
      try {
         // O payload é vazio pois ProcessorPaymentRequestDTO não tem atributos
         await paymentService.process(processingPaymentId, {});
         SuccessToast(
            "Pagamento processado com sucesso.",
            "O pagamento foi processado e você já pode começar a usar o seu plano."
         );
         setProcessingDialogOpen(false);
         fetchPayments();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setProcessingLoading(false);
      }
   };

   return (
      <div className="space-y-6">
         {/* Formulário de criação de pagamento */}
         {isOwnerLogged && !hasPendingPayment && isEndedRecent && (
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
               <AlertDialogTrigger asChild>
                  <Button>Criar novo pagamento</Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Criar novo pagamento</AlertDialogTitle>
                     <AlertDialogDescription>
                        Escolha o método de pagamento.
                     </AlertDialogDescription>
                  </AlertDialogHeader>

                  <Form {...form}>
                     <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                        id="create-payment-form"
                     >
                        <FormField
                           control={form.control}
                           name="method"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Método de pagamento</FormLabel>
                                 <FormControl>
                                    <Select
                                       onValueChange={field.onChange}
                                       value={field.value}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Selecione o método" />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectGroup>
                                             {Object.entries(
                                                PaymentMethodLabels
                                             ).map(([key, label]) => (
                                                <SelectItem
                                                   key={key}
                                                   value={key}
                                                >
                                                   {label}
                                                </SelectItem>
                                             ))}
                                          </SelectGroup>
                                       </SelectContent>
                                    </Select>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <Button
                           type="submit"
                           disabled={loadingAddMember}
                           className="w-full"
                        >
                           {loadingAddMember
                              ? "Carregando..."
                              : "Registrar Pagamento"}
                        </Button>
                     </form>
                  </Form>

                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     <AlertDialogAction
                        form="create-payment-form"
                        type="submit"
                     >
                        Criar
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         )}

         {/* Tabela de pagamentos */}
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  {isOwnerLogged && <TableHead>Ações</TableHead>}
               </TableRow>
            </TableHeader>
            <TableBody>
               {payments.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={6} className="text-center">
                        Nenhum pagamento encontrado.
                     </TableCell>
                  </TableRow>
               )}

               {payments.map((p) => (
                  <TableRow key={p.id}>
                     <TableCell>R$ {p.amount.toFixed(2)}</TableCell>
                     <TableCell>
                        {p.paymentDate
                           ? new Date(p.paymentDate).toLocaleDateString()
                           : "Não pago"}
                     </TableCell>
                     <TableCell>
                        {new Date(p.expirationIn).toLocaleDateString()}
                     </TableCell>
                     <TableCell>{PaymentMethodLabels[p.method]}</TableCell>
                     <TableCell>{PaymentStatusLabels[p.status]}</TableCell>
                     {isOwnerLogged && (
                        <TableCell>
                           {p.status === PaymentStatus.PENDING && (
                              <>
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                       setProcessingPaymentId(p.id);
                                       setProcessingDialogOpen(true);
                                    }}
                                 >
                                    Processar Pagamento
                                 </Button>

                                 <AlertDialog
                                    open={
                                       processingDialogOpen &&
                                       processingPaymentId === p.id
                                    }
                                    onOpenChange={(open) => {
                                       if (!open) {
                                          setProcessingDialogOpen(false);
                                          setProcessingPaymentId(null);
                                       }
                                    }}
                                 >
                                    <AlertDialogContent>
                                       <AlertDialogHeader>
                                          <AlertDialogTitle>
                                             Confirmar Processamento
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                             Tem certeza que deseja processar
                                             este pagamento?
                                          </AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                          <AlertDialogCancel
                                             onClick={() => {
                                                setProcessingDialogOpen(false);
                                                setProcessingPaymentId(null);
                                             }}
                                          >
                                             Cancelar
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                             onClick={handleProcessPayment}
                                             disabled={processingLoading}
                                          >
                                             {processingLoading
                                                ? "Processando..."
                                                : "Confirmar"}
                                          </AlertDialogAction>
                                       </AlertDialogFooter>
                                    </AlertDialogContent>
                                 </AlertDialog>
                              </>
                           )}
                        </TableCell>
                     )}
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
