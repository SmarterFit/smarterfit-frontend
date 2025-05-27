"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogAction,
   AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "../ui/separator";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import {
   UpdatePlanRequestDTO,
   updatePlanRequestSchema,
} from "@/backend/modules/billing/schemas/planSchemas";
import { planService } from "@/backend/modules/billing/services/planServices";
import { CreatedPlanResponseDTO } from "@/backend/modules/billing/types/planTypes";
import { LoadingSpinnerCSS } from "../LoadingSpinner";

export interface PlanDetailsDialogProps {
   plan: CreatedPlanResponseDTO;
}

export function PlanDetailsDialog({ plan }: PlanDetailsDialogProps) {
   const [open, setOpen] = useState(false);
   const [deleting, setDeleting] = useState(false);
   const [saving, setSaving] = useState(false);

   const form = useForm<UpdatePlanRequestDTO>({
      resolver: zodResolver(updatePlanRequestSchema),
      defaultValues: {
         name: plan?.name ?? "",
         description: plan?.description ?? "",
         price: plan?.price ?? 0,
      },
   });

   useEffect(() => {
      if (open) {
         form.reset({
            name: plan?.name ?? "",
            description: plan?.description ?? "",
            price: plan?.price ?? 0,
         });
      }
   }, [open, plan, form]);

   const onSubmit = async (data: UpdatePlanRequestDTO) => {
      setSaving(true);
      try {
         await planService.update(plan.id, data);
         SuccessToast(
            "Plano atualizado!",
            "As informações do plano foram salvas."
         );
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setSaving(false);
      }
   };

   const handleDelete = async () => {
      if (!plan) return;
      setDeleting(true);
      try {
         await planService.delete(plan.id);
         SuccessToast(
            "Plano deletado!",
            `O plano "${plan.name}" foi removido.`
         );
         setOpen(false);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setDeleting(false);
      }
   };

   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
               <Button variant="outline" size="sm">
                  Detalhes
               </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md p-4">
               <DialogHeader>
                  <DialogTitle>Detalhes do plano</DialogTitle>
                  <DialogDescription>
                     Você pode editar as informações do plano ou apagar.
                  </DialogDescription>
               </DialogHeader>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-4"
                  >
                     <div className="flex gap-4 flex-wrap">
                        {/* Nome */}
                        <FormField
                           control={form.control}
                           name="name"
                           render={({ field, fieldState }) => (
                              <FormItem className="flex-1 min-w-[180px]">
                                 <FormLabel htmlFor={field.name}>
                                    Nome do Plano
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       id={field.name}
                                       placeholder="Nome do plano"
                                       {...field}
                                       className={
                                          fieldState.isTouched
                                             ? fieldState.error
                                                ? "border-red-500"
                                                : "border-green-500"
                                             : ""
                                       }
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Preço */}
                        <FormField
                           control={form.control}
                           name="price"
                           render={({ field, fieldState }) => (
                              <FormItem className="flex-1 min-w-[120px]">
                                 <FormLabel htmlFor={field.name}>
                                    Preço (R$)
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       id={field.name}
                                       placeholder="0,00"
                                       {...field}
                                       type="string"
                                       value={
                                          field.value !== undefined &&
                                          field.value !== null
                                             ? Number(field.value)
                                                  .toFixed(2)
                                                  .replace(".", ",")
                                             : ""
                                       }
                                       onChange={(e) => {
                                          const raw = e.target.value.replace(
                                             /\D/g,
                                             ""
                                          );
                                          const num =
                                             raw === ""
                                                ? undefined
                                                : Number(raw) / 100;
                                          field.onChange(num);
                                       }}
                                       className={
                                          fieldState.isTouched
                                             ? fieldState.error
                                                ? "border-red-500"
                                                : "border-green-500"
                                             : ""
                                       }
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Descrição */}
                        <FormField
                           control={form.control}
                           name="description"
                           render={({ field, fieldState }) => (
                              <FormItem className="w-full">
                                 <FormLabel htmlFor={field.name}>
                                    Descrição
                                 </FormLabel>
                                 <FormControl>
                                    <textarea
                                       id={field.name}
                                       rows={4}
                                       placeholder="Descrição do plano"
                                       {...field}
                                       className={`w-full rounded-md border p-2 ${
                                          fieldState.isTouched
                                             ? fieldState.error
                                                ? "border-red-500"
                                                : "border-green-500"
                                             : ""
                                       }`}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <Separator />

                     <div className="flex justify-between">
                        <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="destructive" disabled={deleting}>
                                 {deleting ? "Deletando..." : "Deletar"}
                              </Button>
                           </AlertDialogTrigger>

                           <AlertDialogContent>
                              <AlertDialogHeader>
                                 <AlertDialogTitle>
                                    Confirma exclusão?
                                 </AlertDialogTitle>
                                 <AlertDialogDescription>
                                    Esta ação não pode ser desfeita.
                                 </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={handleDelete}>
                                    {deleting ? "Deletando..." : "Deletar"}
                                 </AlertDialogAction>
                              </AlertDialogFooter>
                           </AlertDialogContent>
                        </AlertDialog>

                        <Button type="submit" disabled={saving}>
                           {saving ? <LoadingSpinnerCSS /> : "Atualizar"}
                        </Button>
                     </div>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>
      </>
   );
}
