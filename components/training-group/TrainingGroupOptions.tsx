"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogFooter,
   AlertDialogCancel,
   AlertDialogAction,
   AlertDialogTitle,
   AlertDialogDescription,
} from "../ui/alert-dialog";
import { trainingGroupService } from "@/backend/modules/training-group/services/trainingGroupServices";
import { SuccessToast, ErrorToast } from "../toasts/Toasts";
import { TrainingGroupResponseDTO } from "@/backend/modules/training-group/types/trainingGroupTypes";
import { useRouter } from "next/navigation";

interface TrainingGroupOptionsProps {
   id: string;
   startDate?: string | null;
   endDate?: string | null;
   onChange?: (updated?: TrainingGroupResponseDTO) => void;
}

export function TrainingGroupOptions({
   id,
   startDate,
   endDate,
   onChange,
}: TrainingGroupOptionsProps) {
   const router = useRouter();
   const [loadingAction, setLoadingAction] = useState<string | null>(null);

   const now = new Date();
   const startDateTemp = startDate ? new Date(startDate) : null;
   const endDateTemp = endDate ? new Date(endDate) : null;

   // Lógica para saber se o grupo está ativo
   const isActive =
      (!startDateTemp || startDateTemp <= now) &&
      (!endDateTemp || endDateTemp >= now);

   const canActivate = !isActive;
   const canFinish = isActive;

   async function handleAction(action: () => Promise<any>, successMsg: string) {
      setLoadingAction(successMsg);
      try {
         const result = await action();
         SuccessToast(successMsg, "Ação realizada com sucesso");
         if (onChange) onChange(result);
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao realizar a ação");
      } finally {
         setLoadingAction(null);
      }
   }

   return (
      <div className="flex gap-2">
         {/* Deletar */}
         <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={loadingAction !== null}
               >
                  Deletar
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                     Tem certeza que deseja excluir este grupo de treinamento?
                     Esta ação não poderá ser desfeita.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => {
                        handleAction(
                           () => trainingGroupService.delete(id),
                           "Grupo excluído!"
                        );
                        router.push("/dashboard");
                     }}
                  >
                     Confirmar
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

         {/* Ativar */}
         {canActivate && (
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button
                     variant="default"
                     className="flex-1"
                     disabled={loadingAction !== null}
                  >
                     Ativar
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Confirmar ativação</AlertDialogTitle>
                     <AlertDialogDescription>
                        Deseja ativar este grupo de treinamento?
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     <AlertDialogAction
                        onClick={() =>
                           handleAction(
                              () => trainingGroupService.activate(id),
                              "Grupo ativado!"
                           )
                        }
                     >
                        Confirmar
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         )}

         {/* Finalizar */}
         {canFinish && (
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button
                     variant="secondary"
                     className="flex-1"
                     disabled={loadingAction !== null}
                  >
                     Finalizar
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Confirmar finalização</AlertDialogTitle>
                     <AlertDialogDescription>
                        Deseja finalizar este grupo de treinamento?
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancelar</AlertDialogCancel>
                     <AlertDialogAction
                        onClick={() =>
                           handleAction(
                              () => trainingGroupService.finish(id),
                              "Grupo finalizado!"
                           )
                        }
                     >
                        Confirmar
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         )}

         {/* Reiniciar */}
         <AlertDialog>
            <AlertDialogTrigger asChild>
               <Button
                  variant="outline"
                  className="flex-1"
                  disabled={loadingAction !== null}
               >
                  Reiniciar
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar reinício</AlertDialogTitle>
                  <AlertDialogDescription>
                     Deseja reiniciar este grupo de treinamento?
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() =>
                        handleAction(
                           () => trainingGroupService.restart(id),
                           "Grupo reiniciado!"
                        )
                     }
                  >
                     Confirmar
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
}
