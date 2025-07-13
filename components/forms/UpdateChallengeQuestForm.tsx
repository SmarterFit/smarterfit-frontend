"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";

// --- Componente Base do Formulário ---
import { ChallengeQuestFormBase } from "./ChallengeQuestFormBase"; // Importando o novo componente base

// --- Services and Types (assumindo caminhos) ---
import { challengeQuestService } from "@/backend/modules/challenge/services/challengeQuestServices";
import { metricTypeService } from "@/backend/modules/useraccess/services/metricTypesService";
import { challengeTypeService } from "@/backend/framework/challenge/services/challengeTypesServices";
import { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ChallengeTypeResponseDTO } from "@/backend/framework/challenge/types/challengeTypes";
import {
   ChallengeQuestRequestDTO,
   challengeQuestRequestSchema,
} from "@/backend/modules/challenge/schemas/challengeQuestSchemas";
import { ChallengeQuestResponseDTO } from "@/backend/modules/challenge/types/challengeQuestTypes";

// --- Componente de Edição ---
export function EditQuestForm({
   quest,
   onQuestUpdate,
}: {
   quest: ChallengeQuestResponseDTO;
   onQuestUpdate: (data: ChallengeQuestResponseDTO) => void;
}) {
   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [metricTypes, setMetricTypes] = useState<MetricTypeResponseDTO[]>([]);
   const [challengeTypes, setChallengeTypes] = useState<
      ChallengeTypeResponseDTO[]
   >([]);

   const formMethods = useForm<ChallengeQuestRequestDTO>({
      resolver: zodResolver(challengeQuestRequestSchema),
      defaultValues: {
         title: quest.title,
         description: quest.description,
         metricTypeId: quest.metricType.id,
         challengeType: quest.challengeType.id, // Usando ID para consistência
         experienceLevel: quest.experienceLevel,
         daysOfWeek: quest.daysOfWeek,
         startDate: parseISO(quest.startDate),
         endDate: parseISO(quest.endDate),
      },
   });

   useEffect(() => {
      async function fetchData() {
         try {
            const [metrics, challenges] = await Promise.all([
               metricTypeService.getAll(),
               challengeTypeService.getEnabledChallengeTypes(),
            ]);
            setMetricTypes(metrics);
            setChallengeTypes(challenges);
         } catch (error) {
            ErrorToast("Falha ao carregar dados para o formulário de edição.");
         }
      }
      fetchData();
   }, []);

   const onSubmit = async (data: ChallengeQuestRequestDTO) => {
      setIsLoading(true);
      const apiPayload = {
         ...data,
         startDate: format(data.startDate, "dd-MM-yyyy"),
         endDate: format(data.endDate, "dd-MM-yyyy"),
      };

      try {
         const updatedQuest = await challengeQuestService.updateChallengeQuest(
            quest.id,
            apiPayload as any
         );
         onQuestUpdate(updatedQuest);
         SuccessToast("Missão atualizada com sucesso!", "Missão Atualizada");
         setOpen(false);
      } catch (error: any) {
         ErrorToast(error.message || "Ocorreu um erro ao atualizar a missão.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline">Editar</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
               <DialogTitle>Editar Missão</DialogTitle>
               <DialogDescription>
                  Modifique os detalhes da missão abaixo.
               </DialogDescription>
            </DialogHeader>
            <FormProvider {...formMethods}>
               <form
                  onSubmit={formMethods.handleSubmit(onSubmit)}
                  className="space-y-4 overflow-y-auto max-h-[60vh] p-2"
               >
                  <ChallengeQuestFormBase
                     metricTypes={metricTypes}
                     challengeTypes={challengeTypes}
                  >
                     <DialogFooter>
                        <Button
                           type="button"
                           variant="ghost"
                           onClick={() => setOpen(false)}
                        >
                           Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                           {isLoading ? (
                              <LoadingSpinnerCSS />
                           ) : (
                              "Salvar Alterações"
                           )}
                        </Button>
                     </DialogFooter>
                  </ChallengeQuestFormBase>
               </form>
            </FormProvider>
         </DialogContent>
      </Dialog>
   );
}
