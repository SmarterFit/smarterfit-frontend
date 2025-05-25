"use client";

import { subscriptionService } from "@/backend/modules/billing/services/subscriptionServices";
import { CreatedPlanResponseDTO } from "@/backend/modules/billing/types/planTypes";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { toast } from "sonner";

type SubscribeToPlanDialogProps = {
   plan: CreatedPlanResponseDTO;
};

export const SubscribeToPlanDialog: React.FC<SubscribeToPlanDialogProps> = ({
   plan,
}) => {
   const user = useUser();
   const [isLoading, setIsLoading] = useState(false);

   if (!user) {
      return <Skeleton className="h-10 w-24 rounded-md" />;
   }

   const handleSubscribe = async () => {
      try {
         setIsLoading(true);
         await subscriptionService.create({
            ownerId: user.id,
            planId: plan.id,
            addOwnerAsParticipant: true,
         });
         toast.success("Assinatura realizada com sucesso!");
      } catch (error) {
         toast.error("Erro ao realizar assinatura.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            <Button variant="default">Assinar</Button>
         </AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>
                  Confirmar assinatura do plano "{plan.name}"?
               </AlertDialogTitle>
               <AlertDialogDescription>
                  Você está prestes a assinar o plano{" "}
                  <strong>{plan.name}</strong>. <br />
                  {plan.description && (
                     <span>Descrição: {plan.description}</span>
                  )}
                  <br />
                  <br />
                  Nenhuma cobrança será realizada automaticamente. Você deverá
                  realizar os pagamentos na aba de{" "}
                  <strong>Minhas Assinaturas</strong>.
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Cancelar</AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleSubscribe}
                  disabled={isLoading}
               >
                  {isLoading ? "Assinando..." : "Confirmar"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
