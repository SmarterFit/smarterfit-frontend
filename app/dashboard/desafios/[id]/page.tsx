"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import { Button } from "@/components/ui/button";
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

// --- Services and Types (assumindo caminhos) ---
import { challengeQuestService } from "@/backend/modules/challenge/services/challengeQuestServices";
import { ChallengeQuestResponseDTO } from "@/backend/modules/challenge/types/challengeQuestTypes";
import { EditQuestForm } from "@/components/forms/UpdateChallengeQuestForm";
import { ChallengeTrailManager } from "@/components/metrics/ChallengeTrailManager";

export default function ChallengeDetailsPage() {
   const { id } = useParams<{ id: string }>();
   const router = useRouter();

   const [loading, setLoading] = useState(true);
   const [isDeleting, setIsDeleting] = useState(false);
   const [quest, setQuest] = useState<ChallengeQuestResponseDTO | null>(null);

   // O estado para a trilha permanece para uso futuro
   const [trail, setTrail] = useState<any | null>(null);

   useEffect(() => {
      if (!id) return;

      async function fetchChallengeData() {
         setLoading(true);
         try {
            const questData = await challengeQuestService.getChallengeQuestById(
               id
            );
            setQuest(questData);

            // TODO: Implementar a busca da trilha associada a esta quest
            // Exemplo: const trailData = await challengeTrailService.findByQuestId(questData.id);
            // setTrail(trailData);
         } catch (e: any) {
            ErrorToast(e.message || "Falha ao carregar dados do desafio.");
            router.push("/dashboard/metricas");
         } finally {
            setLoading(false);
         }
      }

      fetchChallengeData();
   }, [id, router]);

   const handleDelete = async () => {
      if (!id) return;
      setIsDeleting(true);
      try {
         await challengeQuestService.deleteChallengeQuest(id);
         SuccessToast("Missão excluída com sucesso.", "Missão Excluída");
         router.push("/dashboard/metricas"); // Redireciona para a lista
      } catch (e: any) {
         ErrorToast(e.message || "Falha ao excluir a missão.");
      } finally {
         setIsDeleting(false);
      }
   };

   if (loading || !quest) {
      return (
         <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-2/3 rounded-lg" />
            <Skeleton className="h-6 w-1/3 rounded-lg" />
            <div className="pt-4 space-y-2">
               <Skeleton className="h-4 w-full rounded-lg" />
               <Skeleton className="h-4 w-5/6 rounded-lg" />
            </div>
         </div>
      );
   }

   return (
      <div className="w-full lg:max-w-4xl mx-auto flex flex-col gap-6 p-4">
         <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
               <div>
                  <h1 className="text-2xl font-bold">{quest.title}</h1>
                  <p className="text-muted-foreground mt-1">
                     {quest.description}
                  </p>
               </div>
               <div className="flex gap-2">
                  <EditQuestForm quest={quest} onQuestUpdate={setQuest} />

                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <Button variant="destructive">Excluir</Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                           <AlertDialogTitle>
                              Confirmar exclusão
                           </AlertDialogTitle>
                           <AlertDialogDescription>
                              Tem certeza que deseja excluir a missão "
                              {quest.title}"? Esta ação não pode ser desfeita.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                           <AlertDialogCancel>Cancelar</AlertDialogCancel>
                           <AlertDialogAction
                              onClick={handleDelete}
                              disabled={isDeleting}
                           >
                              {isDeleting ? "Excluindo..." : "Excluir"}
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </div>
            </div>
         </div>

         <ChallengeTrailManager
            questId={quest.id}
            isCreditChallenge={
               quest.challengeType.id === "CHALLENGE_EDUCATION_CREDIT"
            }
         />
      </div>
   );
}
