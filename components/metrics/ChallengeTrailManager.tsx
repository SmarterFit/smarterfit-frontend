"use client";

import { useEffect, useState, useCallback } from "react";

import { Input } from "@/components/ui/input";
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
// MODIFICAÇÃO: Adicionada a prop 'isCreditChallenge'
export function ChallengeTrailManager({
   questId,
   isCreditChallenge,
}: {
   questId: string;
   isCreditChallenge: boolean;
}) {
   const [trail, setTrail] = useState<ChallengeTrailResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false); // MODIFICAÇÃO: Adicionado estado para a palavra-chave
   const [keyword, setKeyword] = useState<string>(""); // MODIFICAÇÃO: O hook useEffect para buscar 'classGroups' foi removido pois não é mais necessário.

   const fetchTrail = useCallback(async () => {
      setIsLoading(true);
      try {
         const trailData = await challengeTrailService.findByQuestId(questId);
         setTrail(trailData);
      } catch (error: any) {
         if (error.response?.status === 404) {
            setTrail(null); // Trail doesn't exist, which is an expected state
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
      // MODIFICAÇÃO: Lógica de validação alterada para a palavra-chave
      if (isCreditChallenge && !keyword) {
         ErrorToast("Por favor, digite uma palavra-chave para gerar a trilha.");
         return;
      }

      setIsProcessing(true);
      try {
         // MODIFICAÇÃO: Construção do payload alterada para usar 'keyword'
         const payload: {
            challengeQuestId: string;
            metricDataDTO?: { data: { keyword: string } };
         } = {
            challengeQuestId: questId,
         };

         if (isCreditChallenge && keyword) {
            payload.metricDataDTO = {
               data: {
                  keyword: keyword,
               },
            };
         }

         const newTrail = await challengeService.generateChallenge(payload);
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
            <CardTitle>Gerenciamento da Trilha</CardTitle>{" "}
            <CardDescription>
               Crie, regere ou exclua a trilha de dias para esta missão.{" "}
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {" "}
            <div className="flex flex-wrap items-center gap-2">
               {/* MODIFICAÇÃO: O Select foi substituído pelo Input condicional */}
               {isCreditChallenge && (
                  <Input
                     type="text"
                     placeholder="Digite a palavra-chave"
                     value={keyword}
                     onChange={(e) => setKeyword(e.target.value)}
                     className="w-full sm:w-[200px]"
                  />
               )}
               <Button
                  onClick={handleGenerateOrRegenerate} // MODIFICAÇÃO: Lógica de 'disabled' atualizada
                  disabled={isProcessing || (isCreditChallenge && !keyword)}
               >
                  {" "}
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
                           Excluir Trilha{" "}
                        </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        {" "}
                        <AlertDialogHeader>
                           <AlertDialogTitle>
                              Confirmar exclusão
                           </AlertDialogTitle>
                           <AlertDialogDescription>
                              Tem certeza que deseja excluir esta trilha? Todos
                              os dias e passos associados serão perdidos. Esta
                              ação não pode ser desfeita.
                           </AlertDialogDescription>{" "}
                        </AlertDialogHeader>{" "}
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancelar</AlertDialogCancel>
                           <AlertDialogAction
                              onClick={handleDeleteTrail}
                              disabled={isProcessing}
                           >
                              {" "}
                              {isProcessing ? <LoadingSpinnerCSS /> : "Excluir"}
                           </AlertDialogAction>{" "}
                        </AlertDialogFooter>
                     </AlertDialogContent>{" "}
                  </AlertDialog>
               )}{" "}
            </div>{" "}
            {trail && trail.days.length > 0 ? (
               <ChallengeDaysDisplay
                  days={trail.days}
                  onDaysChange={handleDaysChange}
               />
            ) : (
               <div className="p-4 border-dashed border-2 rounded-lg text-center mt-4">
                  {" "}
                  <p className="text-sm text-muted-foreground">
                     {trail
                        ? "Nenhum dia encontrado para esta trilha."
                        : "Gere uma trilha para começar."}{" "}
                  </p>
               </div>
            )}
         </CardContent>{" "}
      </Card>
   );
}
