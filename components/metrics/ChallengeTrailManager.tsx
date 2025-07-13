"use client";

import { useEffect, useState, useCallback } from "react";

// --- UI Components ---
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
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

// --- Services & Types ---
import { ChallengeTrailResponseDTO } from "@/backend/modules/challenge/types/challengeTrailTypes";
import { challengeService } from "@/backend/framework/challenge/services/challengeServices";
import { challengeTrailService } from "@/backend/modules/challenge/services/challengeTrailServices";
import { ChallengeDaysDisplay } from "./ChallengeDaysDisplay";
import { ChallengeDayResponseDTO } from "@/backend/modules/challenge/types/challengeDayTypes";

// --- Componente de Gerenciamento da Trilha ---
export function ChallengeTrailManager({ questId }: { questId: string }) {
   const [trail, setTrail] = useState<ChallengeTrailResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false);

   const fetchTrail = useCallback(async () => {
      setIsLoading(true);
      try {
         const trailData = await challengeTrailService.findByQuestId(questId);
         setTrail(trailData);
      } catch (error: any) {
         if (error.response?.status === 404) {
            setTrail(null); // Trilha não existe, o que é um estado esperado
         } else {
            ErrorToast("Falha ao verificar a existência da trilha.");
         }
      } finally {
         setIsLoading(false);
      }
   }, [questId]);

   useEffect(() => {
      fetchTrail();
   }, [fetchTrail]);

   const handleDaysChange = (newDays: ChallengeDayResponseDTO[]) => {
      if (trail) {
         setTrail({
            ...trail,
            days: newDays,
         });
      }
   };

   const handleGenerateOrRegenerate = async () => {
      setIsProcessing(true);
      try {
         const newTrail = await challengeService.generateChallenge({
            challengeQuestId: questId,
         });
         setTrail(newTrail);
         SuccessToast(
            trail
               ? "Trilha regerada com sucesso!"
               : "Trilha criada com sucesso!",
            "Ação Concluída"
         );
      } catch (e: any) {
         ErrorToast(e.message || "Falha ao processar a trilha.");
      } finally {
         setIsProcessing(false);
      }
   };

   const handleDeleteTrail = async () => {
      if (!trail) return;
      setIsProcessing(true);
      try {
         await challengeTrailService.delete(trail.id);
         setTrail(null);
         SuccessToast("Trilha excluída com sucesso.", "Trilha Excluída");
      } catch (e: any) {
         ErrorToast(e.message || "Falha ao excluir a trilha.");
      } finally {
         setIsProcessing(false);
      }
   };

   if (isLoading) {
      return <Skeleton className="h-32 w-full" />;
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Gerenciamento da Trilha</CardTitle>
            <CardDescription>
               Crie, regere ou exclua a trilha de dias para esta missão.
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="flex gap-2">
               <Button
                  onClick={handleGenerateOrRegenerate}
                  disabled={isProcessing}
               >
                  {isProcessing && trail === null ? (
                     <LoadingSpinnerCSS />
                  ) : trail ? (
                     "Regerar Trilha"
                  ) : (
                     "Gerar Trilha"
                  )}
               </Button>
               {trail && (
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isProcessing}>
                           Excluir Trilha
                        </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>
                              Confirmar exclusão
                           </AlertDialogTitle>
                           <AlertDialogDescription>
                              Tem certeza que deseja excluir esta trilha? Todos
                              os dias e passos associados serão perdidos. Esta
                              ação não pode ser desfeita.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancelar</AlertDialogCancel>
                           <AlertDialogAction
                              onClick={handleDeleteTrail}
                              disabled={isProcessing}
                           >
                              {isProcessing ? <LoadingSpinnerCSS /> : "Excluir"}
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               )}
            </div>

            {trail && trail.days.length > 0 ? (
               <ChallengeDaysDisplay
                  days={trail.days}
                  onDaysChange={handleDaysChange}
               />
            ) : (
               <div className="p-4 border-dashed border-2 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                     {trail
                        ? "Nenhum dia encontrado para esta trilha."
                        : "Gere uma trilha para começar."}
                  </p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
