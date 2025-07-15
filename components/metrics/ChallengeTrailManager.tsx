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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
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
import { ClassGroupResponseDTO } from "@/backend/modules/classgroup/types/classGroupTypes";
import { classGroupUserService } from "@/backend/modules/classgroup/service/classGroupUserService";
import { useUser } from "@/hooks/useUser";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";

// --- Componente de Gerenciamento da Trilha ---
export function ChallengeTrailManager({ questId }: { questId: string }) {
   const [trail, setTrail] = useState<ChallengeTrailResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isProcessing, setIsProcessing] = useState(false);
   const [classGroups, setClassGroups] = useState<ClassGroupResponseDTO[]>([]);
   const [selectedClassGroupId, setSelectedClassGroupId] = useState<string>("");

   const user: UserResponseDTO | null = useUser(); // Fetch class groups for the user

   useEffect(() => {
      const fetchClassGroups = async () => {
         if (user?.id) {
            try {
               const fetchedClassGroups =
                  await classGroupUserService.getClassGroupsByUserId(user.id);
               setClassGroups(fetchedClassGroups || []);
               if (fetchedClassGroups && fetchedClassGroups.length > 0) {
                  setSelectedClassGroupId(fetchedClassGroups[0].id);
               }
            } catch (error) {
               ErrorToast("Falha ao buscar as turmas.");
               setClassGroups([]);
            }
         }
      };

      fetchClassGroups();
   }, [user?.id]);

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
      if (classGroups.length > 0 && !selectedClassGroupId) {
         ErrorToast("Por favor, selecione uma turma para gerar a trilha.");
         return;
      }

      setIsProcessing(true);
      try {
         // Construct the payload for the service call
         const payload: {
            challengeQuestId: string;
            metricDataDTO?: { data: { classGroupId: string } };
         } = {
            challengeQuestId: questId,
         }; // Add class group ID to payload if it's selected

         if (selectedClassGroupId) {
            payload.metricDataDTO = {
               data: {
                  classGroupId: selectedClassGroupId,
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
               {classGroups.length > 0 && (
                  <Select
                     value={selectedClassGroupId}
                     onValueChange={setSelectedClassGroupId}
                  >
                     {" "}
                     <SelectTrigger className="w-full sm:w-[200px]">
                        {" "}
                        <SelectValue placeholder="Selecione uma turma" />{" "}
                     </SelectTrigger>{" "}
                     <SelectContent>
                        {" "}
                        {classGroups.map((group) => (
                           <SelectItem key={group.id} value={group.id}>
                              {group.title}{" "}
                           </SelectItem>
                        ))}{" "}
                     </SelectContent>{" "}
                  </Select>
               )}
               <Button
                  onClick={handleGenerateOrRegenerate}
                  disabled={
                     isProcessing ||
                     (classGroups.length > 0 && !selectedClassGroupId)
                  }
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
