import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { PaymentResponseDTO } from "@/backend/modules/billing/types/paymentTypes";
import {
   CreatePaymentRequestDTO,
   createPaymentRequestSchema,
} from "@/backend/modules/billing/schemas/paymentSchemas";
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
import { paymentMethodService } from "@/backend/framework/billing/services/paymentMethodServices";
import { PaymentMethodResponseDTO } from "@/backend/framework/billing/types/paymentMethodTypes";
import { useUser } from "@/hooks/useUser"; // 1. Importe o hook useUser

export function PaymentsTabContent({
   subscriptionId,
   endedIn,
   isOwnerLogged,
}: {
   subscriptionId: string;
   endedIn: string | null | undefined;
   isOwnerLogged: boolean;
}) {
   const user = useUser(); // 2. Obtenha o usuário logado
   const [payments, setPayments] = useState<PaymentResponseDTO[]>([]);
   const [paymentMethods, setPaymentMethods] = useState<
      PaymentMethodResponseDTO[]
   >([]);
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
         methodId: "",
      },
   });

   // Buscar pagamentos e métodos de pagamento
   const fetchData = async () => {
      setLoading(true);
      try {
         const [paymentsResponse, methodsResponse] = await Promise.all([
            paymentService.getAllBySubscriptionId(subscriptionId),
            paymentMethodService.getEnabledPaymentMethods(),
         ]);

         setPayments(paymentsResponse);
         setPaymentMethods(methodsResponse);

         if (methodsResponse.length > 0) {
            form.setValue("methodId", methodsResponse[0].id);
         }

         const pending = paymentsResponse.some(
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
      fetchData();
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
         form.reset({ subscriptionId, methodId: paymentMethods[0]?.id || "" });
         fetchData();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoadingAddMember(false);
      }
   };

   // Função para processar pagamento (ATUALIZADA)
   const handleProcessPayment = async () => {
      if (!processingPaymentId) return;

      const paymentToProcess = payments.find(
         (p) => p.id === processingPaymentId
      );

      if (!paymentToProcess) {
         ErrorToast("Erro: Pagamento não encontrado.");
         return;
      }

      setProcessingLoading(true);
      try {
         // Constrói o payload dinamicamente
         let payload: { data: Record<string, any> } = { data: {} };

         // Verifica se o método é "Pontos de Grupo"
         if (paymentToProcess.method.name === "Pontos de Grupo") {
            if (!user?.id) {
               ErrorToast(
                  "Erro: Usuário não autenticado para processar o pagamento."
               );
               setProcessingLoading(false);
               return;
            }

            // Adiciona os dados necessários ao payload
            payload = {
               data: {
                  userId: user.id,
                  amount: paymentToProcess.amount,
               },
            };
         }

         console.log(payload);

         // Envia a requisição com o payload correto
         await paymentService.process(processingPaymentId, payload);

         SuccessToast(
            "Pagamento processado com sucesso.",
            "O pagamento foi processado e você já pode começar a usar o seu plano."
         );
         setProcessingDialogOpen(false);
         localStorage.setItem("hasActiveSubscription", "true");
         fetchData();
      } catch (e: any) {
         ErrorToast(e.message || "Ocorreu um erro ao processar o pagamento.");
      } finally {
         setProcessingLoading(false);
         setProcessingPaymentId(null);
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
                           name="methodId"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Método de pagamento</FormLabel>
                                 <FormControl>
                                    <Select
                                       onValueChange={field.onChange}
                                       value={field.value}
                                       disabled={paymentMethods.length === 0}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Selecione o método" />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectGroup>
                                             {paymentMethods.map((method) => (
                                                <SelectItem
                                                   key={method.id}
                                                   value={method.id}
                                                >
                                                   {method.name}
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
                     </form>
                  </Form>

                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     <AlertDialogAction
                        form="create-payment-form"
                        type="submit"
                        disabled={loadingAddMember}
                     >
                        {loadingAddMember ? "Criando..." : "Criar"}
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
               {payments.length === 0 && !loading && (
                  <TableRow>
                     <TableCell
                        colSpan={isOwnerLogged ? 6 : 5}
                        className="text-center"
                     >
                        Nenhum pagamento encontrado.
                     </TableCell>
                  </TableRow>
               )}
               {loading && (
                  <TableRow>
                     <TableCell
                        colSpan={isOwnerLogged ? 6 : 5}
                        className="text-center"
                     >
                        Carregando pagamentos...
                     </TableCell>
                  </TableRow>
               )}
               {payments.map((p) => (
                  <TableRow key={p.id}>
                     <TableCell>R$ {p.amount.toFixed(2)}</TableCell>
                     <TableCell>
                        {p.paymentDate
                           ? new Date(p.paymentDate).toLocaleDateString("pt-BR")
                           : "Não pago"}
                     </TableCell>
                     <TableCell>
                        {new Date(p.expirationIn).toLocaleDateString("pt-BR")}
                     </TableCell>
                     <TableCell>{p.method.name}</TableCell>
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
