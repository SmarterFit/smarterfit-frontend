"use client";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
   createWorkoutPlanSchemas,
   CreateWorkoutPlanRequestDTO,
} from "@/backend/modules/training/schemas/workoutPlanSchemas";
import { workoutPlanService } from "@/backend/modules/training/services/workoutPlanServices";
import { WorkoutPlanResponseDTO } from "@/backend/modules/training/types/workoutPlanTypes";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { Textarea } from "../ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatService } from "@/backend/modules/ai/services/chatServices";

interface WorkoutPlanFormProps {
   trainingGoalId: string;
   onSaved?: (plan: WorkoutPlanResponseDTO) => void;
}

export const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({
   trainingGoalId,
   onSaved,
}) => {
   const [isCreate, setIsCreate] = useState(true);
   const [loading, setLoading] = useState(true);
   const [submitting, setSubmitting] = useState(false);
   const [showPreview, setShowPreview] = useState(false);
   const [generating, setGenerating] = useState(false);

   const form = useForm<CreateWorkoutPlanRequestDTO>({
      resolver: zodResolver(createWorkoutPlanSchemas),
      defaultValues: { trainingGoalId, title: "", description: "" } as any,
   });

   useEffect(() => {
      async function load() {
         try {
            const plan = await workoutPlanService.getById(trainingGoalId);
            if (plan) {
               form.reset({
                  trainingGoalId,
                  title: plan.title,
                  description: plan.description,
               } as any);
               setIsCreate(false);
            }
         } catch (e: any) {
            console.log(e)
         } finally {
            setLoading(false);
         }
      }
      load();
   }, [trainingGoalId]);

   const onSubmit = async (data: CreateWorkoutPlanRequestDTO) => {
      setSubmitting(true);
      try {
         let result: WorkoutPlanResponseDTO;
         if (isCreate) result = await workoutPlanService.create(data);
         else result = await workoutPlanService.update(data);
         SuccessToast(
            isCreate ? "Plano cadastrado!" : "Plano atualizado!",
            isCreate
               ? "Seu plano foi salvo com sucesso."
               : "Seu plano foi atualizado com sucesso."
         );
         onSaved?.(result);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSubmitting(false);
      }
   };

   const handleGenerate = async () => {
      setGenerating(true);
      try {
         const generated = await chatService.askGroqTraining();
         // Preenche o formulário com o plano gerado
         form.reset({
            trainingGoalId,
            title: generated.title,
            description: generated.description,
         } as any);
         setIsCreate(false);
         SuccessToast("Plano gerado!", "Plano de treino criado com IA.");
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setGenerating(false);
      }
   };

   if (loading) return <Skeleton className="h-64 w-full" />;

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Título</FormLabel>
                     <FormControl>
                        <Input placeholder="Título do plano" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Descrição</FormLabel>
                     <div className="flex items-center justify-between mb-2">
                        <Button
                           variant="outline"
                           size="sm"
                           type="button"
                           onClick={() => setShowPreview(!showPreview)}
                        >
                           {showPreview ? "Editar" : "Visualizar Markdown"}
                        </Button>
                     </div>
                     <FormControl>
                        {showPreview ? (
                           <div className="prose max-w-full p-4 border rounded">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                 {field.value || ""}
                              </ReactMarkdown>
                           </div>
                        ) : (
                           <Textarea
                              rows={8}
                              placeholder="Descrição do plano (Markdown)"
                              {...field}
                           />
                        )}
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex justify-end gap-4">
               <Button type="submit" disabled={submitting}>
                  {isCreate ? "Salvar" : "Atualizar"}
               </Button>
               <Button
                  variant="outline"
                  disabled={generating}
                  onClick={handleGenerate}
               >
                  {generating ? "Gerando..." : "Gerar com IA"}
               </Button>
            </div>
         </form>
      </Form>
   );
};
