"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
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
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
import { cn } from "@/lib/utils";

// --- Services & Types ---
import {
   challengeDayRequestUpdateSchema,
   ChallengeDayRequestUpdateDTO,
} from "@/backend/modules/challenge/schemas/challengeDaySchemas";
import { challengeDayService } from "@/backend/modules/challenge/services/challengeDayServices";
import { ChallengeDayResponseDTO } from "@/backend/modules/challenge/types/challengeDayTypes";
import { ChallengeStepsManager } from "./ChallengeStepsManager";

// --- Componente de Edição de Dia ---
function EditDayDialog({
   day,
   onDayUpdate,
}: {
   day: ChallengeDayResponseDTO;
   onDayUpdate: (updatedDay: ChallengeDayResponseDTO) => void;
}) {
   const [open, setOpen] = useState(false);
   const [isProcessing, setIsProcessing] = useState(false);

   const form = useForm<ChallengeDayRequestUpdateDTO>({
      resolver: zodResolver(challengeDayRequestUpdateSchema),
      defaultValues: {
         date: parseISO(day.date),
      },
   });

   const handleUpdate = async (data: ChallengeDayRequestUpdateDTO) => {
      setIsProcessing(true);
      try {
         const updatedDay = await challengeDayService.update(day.id, {
            date: format(data.date, "dd-MM-yyyy"),
         } as any);
         onDayUpdate(updatedDay);
         SuccessToast("Data do dia atualizada com sucesso!", "Dia Atualizado");
         setOpen(false);
      } catch (e: any) {
         ErrorToast(e.message || "Falha ao atualizar o dia.");
      } finally {
         setIsProcessing(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button variant="outline" size="sm">
               Alterar Data
            </Button>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Alterar data do dia</DialogTitle>
               <DialogDescription>
                  Selecione a nova data para este dia da trilha.
               </DialogDescription>
            </DialogHeader>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleUpdate)}
                  className="space-y-4"
               >
                  <FormField
                     control={form.control}
                     name="date"
                     render={({ field }) => (
                        <FormItem className="flex flex-col">
                           <FormLabel>Nova Data</FormLabel>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button
                                       variant={"outline"}
                                       className={cn(
                                          "pl-3 text-left font-normal",
                                          !field.value &&
                                             "text-muted-foreground"
                                       )}
                                    >
                                       {field.value ? (
                                          format(field.value, "PPP", {
                                             locale: ptBR,
                                          })
                                       ) : (
                                          <span>Escolha uma data</span>
                                       )}
                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                 className="w-auto p-0"
                                 align="start"
                              >
                                 <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <DialogFooter>
                     <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                     >
                        Cancelar
                     </Button>
                     <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? <LoadingSpinnerCSS /> : "Salvar"}
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}

// --- Componente Principal de Visualização dos Dias ---
export function ChallengeDaysDisplay({
   days,
   onDaysChange,
}: {
   days: ChallengeDayResponseDTO[];
   onDaysChange: (newDays: ChallengeDayResponseDTO[]) => void;
}) {
   const [isDeleting, setIsDeleting] = useState<string | null>(null);

   const handleDayUpdate = (updatedDay: ChallengeDayResponseDTO) => {
      const newDays = days.map((d) =>
         d.id === updatedDay.id ? updatedDay : d
      );
      onDaysChange(newDays);
   };

   const handleDayDelete = async (dayId: string) => {
      setIsDeleting(dayId);
      try {
         await challengeDayService.delete(dayId);
         const newDays = days.filter((d) => d.id !== dayId);
         onDaysChange(newDays);
         SuccessToast("Dia excluído com sucesso.", "Dia Excluído");
      } catch (e: any) {
         ErrorToast(e.message || "Falha ao excluir o dia.");
      } finally {
         setIsDeleting(null);
      }
   };

   // Ordena os dias pela data antes de renderizar
   const sortedDays = [...days].sort(
      (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()
   );

   return (
      <Accordion type="single" collapsible className="w-full">
         {sortedDays.map((day) => (
            <AccordionItem value={day.id} key={day.id}>
               <AccordionTrigger>
                  Dia{" "}
                  {format(parseISO(day.date), "dd/MM/yyyy", { locale: ptBR })}
               </AccordionTrigger>
               <AccordionContent>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                           Gerencie o dia e seus passos.
                        </p>
                        <div className="flex gap-2">
                           <EditDayDialog
                              day={day}
                              onDayUpdate={handleDayUpdate}
                           />
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={!!isDeleting}
                                 >
                                    {isDeleting === day.id ? (
                                       <LoadingSpinnerCSS />
                                    ) : (
                                       "Excluir Dia"
                                    )}
                                 </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                 <AlertDialogHeader>
                                    <AlertDialogTitle>
                                       Confirmar exclusão
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                       Tem certeza que deseja excluir este dia e
                                       todos os seus passos? Esta ação não pode
                                       ser desfeita.
                                    </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                    <AlertDialogCancel>
                                       Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                       onClick={() => handleDayDelete(day.id)}
                                    >
                                       Excluir
                                    </AlertDialogAction>
                                 </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        </div>
                     </div>
                     <div className="p-4 border-dashed border-2 rounded-lg text-center">
                        <ChallengeStepsManager
                           initialSteps={day.steps}
                           challengeDayId={day.id}
                        />
                     </div>
                  </div>
               </AccordionContent>
            </AccordionItem>
         ))}
      </Accordion>
   );
}
