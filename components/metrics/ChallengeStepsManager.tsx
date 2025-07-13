"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";

// --- UI Components ---
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
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";

// --- Services & Types ---
import { challengeStepService } from "@/backend/modules/challenge/services/challengeStepServices";
import {
   challengeStepRequestSchema,
   ChallengeStepRequestDTO,
} from "@/backend/modules/challenge/schemas/challengeStepSchemas";
import { ChallengeStepResponseDTO } from "@/backend/modules/challenge/types/challengeStepTypes";

interface ChallengeStepsManagerProps {
   initialSteps: ChallengeStepResponseDTO[];
   challengeDayId: string;
}

export function ChallengeStepsManager({
   initialSteps,
   challengeDayId,
}: ChallengeStepsManagerProps) {
   const [steps, setSteps] = useState<ChallengeStepResponseDTO[]>(initialSteps);
   const [isProcessing, setIsProcessing] = useState(false);

   const form = useForm({
      resolver: zodResolver(challengeStepRequestSchema),
      defaultValues: { description: "", completed: false, challengeDayId },
   });

   const handleCreateStep = async (data: ChallengeStepRequestDTO) => {
      setIsProcessing(true);
      try {
         const newStep = await challengeStepService.create(data);
         setSteps((prev) => [...prev, newStep]);
         form.reset({ ...form.getValues(), description: "" });
         SuccessToast("Passo adicionado com sucesso!", "Passo Adicionado");
      } catch (error: any) {
         ErrorToast(error.message || "Falha ao adicionar passo.");
      } finally {
         setIsProcessing(false);
      }
   };

   const handleDeleteStep = async (stepId: string) => {
      try {
         await challengeStepService.delete(stepId);
         setSteps((prev) => prev.filter((s) => s.id !== stepId));
         SuccessToast("Passo excluído com sucesso.", "Passo Excluído");
      } catch (error: any) {
         ErrorToast(error.message || "Falha ao excluir passo.");
      }
   };

   const handleToggleComplete = async (stepId: string) => {
      try {
         const updatedStep = await challengeStepService.toggle(stepId);
         setSteps((prev) =>
            prev.map((s) => (s.id === stepId ? updatedStep : s))
         );
      } catch (error: any) {
         ErrorToast(error.message || "Falha ao atualizar o passo.");
      }
   };

   return (
      <div className="pl-4 space-y-4">
         <ul className="space-y-3">
            {steps.map((step) => (
               <li
                  key={step.id}
                  className="flex items-center justify-between group transition-colors p-2 rounded-md hover:bg-accent"
               >
                  <div className="flex items-center gap-3">
                     <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleToggleComplete(step.id)}
                     >
                        {step.completed ? (
                           <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                           <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                     </Button>
                     <span
                        className={cn(
                           "text-sm font-medium",
                           step.completed &&
                              "line-through text-muted-foreground"
                        )}
                     >
                        {step.description}
                     </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                           >
                              <Trash2 className="h-4 w-4 text-destructive" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>
                                 Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                 Tem certeza que deseja excluir o passo "
                                 {step.description}"?
                              </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={() => handleDeleteStep(step.id)}
                              >
                                 Excluir
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  </div>
               </li>
            ))}
         </ul>

         {steps.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">
               Nenhum passo cadastrado para este dia.
            </p>
         )}

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleCreateStep)}
               className="mt-4 flex gap-2"
            >
               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem className="flex-grow">
                        <FormControl>
                           <Input
                              placeholder="Adicionar novo passo..."
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
               <Button type="submit" size="sm" disabled={isProcessing}>
                  {isProcessing ? <LoadingSpinnerCSS /> : "Adicionar"}
               </Button>
            </form>
         </Form>
      </div>
   );
}
