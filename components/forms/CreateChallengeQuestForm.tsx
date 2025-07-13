"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

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
import {
   ChallengeQuestRequestDTO,
   challengeQuestRequestSchema,
} from "@/backend/modules/challenge/schemas/challengeQuestSchemas";
import { ChallengeQuestResponseDTO } from "@/backend/modules/challenge/types/challengeQuestTypes";
import { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ChallengeTypeResponseDTO } from "@/backend/framework/challenge/types/challengeTypes";

interface CreateChallengeQuestProps {
   setQuests: React.Dispatch<React.SetStateAction<ChallengeQuestResponseDTO[]>>;
}

export function CreateChallengeQuest({ setQuests }: CreateChallengeQuestProps) {
   const [open, setOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [metricTypes, setMetricTypes] = useState<MetricTypeResponseDTO[]>([]);
   const [challengeTypes, setChallengeTypes] = useState<
      ChallengeTypeResponseDTO[]
   >([]);

   const formMethods = useForm<ChallengeQuestRequestDTO>({
      resolver: zodResolver(challengeQuestRequestSchema),
      defaultValues: {
         title: "",
         description: "",
         daysOfWeek: [],
         startDate: undefined,
         endDate: undefined,
      },
   });

   // Fetch data for select dropdowns
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
            ErrorToast("Falha ao carregar dados para o formulário.");
            console.error(error);
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
         const newQuest = await challengeQuestService.createChallengeQuest(
            apiPayload as any
         );
         setQuests((prevQuests) => [...prevQuests, newQuest]);
         SuccessToast(
            "Missão criada com sucesso!",
            "A nova missão foi adicionada e está disponível na lista."
         );
         formMethods.reset();
         setOpen(false);
      } catch (error: any) {
         ErrorToast(error.message || "Ocorreu um erro ao criar a missão.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button>Criar Nova Missão</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
               <DialogTitle>Criar Nova Missão</DialogTitle>
               <DialogDescription>
                  Preencha os detalhes abaixo para criar uma nova missão de
                  desafio.
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
                           {isLoading ? <LoadingSpinnerCSS /> : "Criar Missão"}
                        </Button>
                     </DialogFooter>
                  </ChallengeQuestFormBase>
               </form>
            </FormProvider>
         </DialogContent>
      </Dialog>
   );
}
