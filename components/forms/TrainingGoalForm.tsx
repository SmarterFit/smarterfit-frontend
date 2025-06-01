import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectGroup,
   SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
   createTrainingGoalSchema,
   CreateTrainingGoalRequestDTO,
} from "@/backend/modules/training/schemas/trainingGoalSchemas";
import { trainingGoalService } from "@/backend/modules/training/services/trainingGoalServices";
import { TrainingGoalResponseDTO } from "@/backend/modules/training/types/trainingGoalTypes";
import { Goal, GoalLabels } from "@/backend/common/enums/goalEnum";
import {
   ExperienceLevel,
   ExperienceLevelLabels,
} from "@/backend/common/enums/experienceLevelEnum";
import { WorkoutPlanForm } from "./WorkoutPlanForm";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";

export const TrainingGoalForm: React.FC = () => {
   const [goalData, setGoalData] = useState<TrainingGoalResponseDTO | null>(
      null
   );
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);

   const form = useForm<CreateTrainingGoalRequestDTO>({
      resolver: zodResolver(createTrainingGoalSchema),
      defaultValues: {
         goal: Goal.HYPERTROPHY,
         experienceLevel: ExperienceLevel.BEGINNER,
         weeklyFrequency: 3,
      },
   });

   useEffect(() => {
      trainingGoalService
         .getByUserId()
         .then((res) => {
            if (res) {
               setGoalData(res);
               form.reset({
                  goal: res.goal,
                  experienceLevel: res.experienceLevel,
                  weeklyFrequency: res.weeklyFrequency,
               });
            }
         })
         .catch(() => {})
         .finally(() => setLoading(false));
   }, []);

   const onSubmit = async (data: CreateTrainingGoalRequestDTO) => {
      setSubmitting(true);
      try {
         let saved: TrainingGoalResponseDTO;
         if (goalData) {
            saved = await trainingGoalService.update(data);
            SuccessToast(
               "Objetivo atualizado!",
               "Seu objetivo foi atualizado com sucesso."
            );
         } else {
            saved = await trainingGoalService.create(data);
            SuccessToast(
               "Objetivo cadastrado!",
               "Seu objetivo foi salvo com sucesso."
            );
         }
         setGoalData(saved);
      } catch (error: any) {
         ErrorToast(error.message);
      } finally {
         setSubmitting(false);
      }
   };

   if (loading) {
      return <Skeleton className="h-48 w-full" />;
   }

   return (
      <div className="space-y-8">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
               <FormField
                  control={form.control}
                  name="weeklyFrequency"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Frequência Semanal</FormLabel>
                        <FormControl>
                           <Input
                              type="string"
                              {...field}
                              value={
                                 field.value !== undefined &&
                                 field.value !== null
                                    ? field.value
                                    : 0
                              }
                              onChange={(e) => {
                                 let val = e.target.value;
                                 val = val.replace(/^0+(?!$)/, "");
                                 let num = val === "" ? 0 : Number(val);
                                 if (isNaN(num)) {
                                    num = 0;
                                 } else if (num && num < 0) {
                                    num = 1;
                                 } else if (num && num > 7) {
                                    num = 7;
                                 }
                                 field.onChange(num);
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Objetivo</FormLabel>
                        <FormControl>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Selecione o objetivo" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    {Object.values(Goal).map((g) => (
                                       <SelectItem key={g} value={g}>
                                          {GoalLabels[g]}
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
               <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Nível de Experiência</FormLabel>
                        <FormControl>
                           <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Selecione o nível" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    {Object.values(ExperienceLevel).map(
                                       (lvl) => (
                                          <SelectItem key={lvl} value={lvl}>
                                             {ExperienceLevelLabels[lvl]}
                                          </SelectItem>
                                       )
                                    )}
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" disabled={submitting}>
                     {goalData ? "Atualizar" : "Salvar"}
                  </Button>
               </div>
            </form>
         </Form>
         {goalData && (
            <WorkoutPlanForm trainingGoalId={goalData.id} onSaved={() => {}} />
         )}
      </div>
   );
};
