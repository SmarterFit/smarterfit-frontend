"use client";

import {
   CreatePlanRequestDTO,
   createPlanRequestSchema,
} from "@/backend/modules/billing/schemas/planSchemas";
import { planService } from "@/backend/modules/billing/services/planServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "../ui/button";
import { LoadingSpinnerCSS } from "../LoadingSpinner";

export default function CreatePlanForm() {
   const [loading, setLoading] = useState(false);
   const form = useForm<CreatePlanRequestDTO>({
      resolver: zodResolver(createPlanRequestSchema),
      mode: "onChange",
      defaultValues: {
         name: "",
         description: "",
         price: 0,
         duration: 0,
         maxUsers: 0,
         maxClasses: 0,
      },
   });

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors, touchedFields },
   } = form;

   async function onSubmit(data: CreatePlanRequestDTO) {
      setLoading(true);
      try {
         await planService.create(data);
         SuccessToast("Plano criado com sucesso!", "Seu plano foi criado.");
         reset();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoading(false);
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4 flex-wrap">
               <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                     <FormItem className="flex-1 min-w-[180px]">
                        <FormLabel>Nome do Plano</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="Nome do plano"
                              className={clsx(
                                 touchedFields.name &&
                                    (errors.name
                                       ? "border-red-500"
                                       : "border-green-500")
                              )}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Novo campo description como textarea */}
               <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                     <FormItem className="w-full">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                           <textarea
                              {...field}
                              rows={4}
                              placeholder="Descrição do plano"
                              className={clsx(
                                 "w-full rounded-md border p-2",
                                 touchedFields.description &&
                                    (errors.description
                                       ? "border-red-500"
                                       : "border-green-500")
                              )}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={control}
                  name="price"
                  render={({ field }) => (
                     <FormItem className="flex-1 min-w-[120px]">
                        <FormLabel>Preço (R$)</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type="string"
                              min={0}
                              step={0.01}
                              placeholder="0,00"
                              className={clsx(
                                 touchedFields.price &&
                                    (errors.price
                                       ? "border-red-500"
                                       : "border-green-500")
                              )}
                              value={
                                 field.value !== undefined &&
                                 field.value !== null
                                    ? Number(field.value)
                                         .toFixed(2)
                                         .replace(".", ",")
                                    : ""
                              }
                              onChange={(e) => {
                                 // só números, remover tudo que não é dígito
                                 const raw = e.target.value.replace(/\D/g, "");
                                 // converte para número dividido por 100
                                 const num =
                                    raw === "" ? undefined : Number(raw) / 100;
                                 field.onChange(num);
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={control}
                  name="duration"
                  render={({ field }) => (
                     <FormItem className="flex-1 min-w-[120px]">
                        <FormLabel>Duração (dias)</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type="string"
                              min={1}
                              placeholder="0"
                              className={clsx(
                                 touchedFields.duration &&
                                    (errors.duration
                                       ? "border-red-500"
                                       : "border-green-500")
                              )}
                              value={
                                 field.value !== undefined &&
                                 field.value !== null
                                    ? field.value
                                    : ""
                              }
                              onChange={(e) => {
                                 let val = e.target.value;
                                 val = val.replace(/^0+(?!$)/, ""); // remove zeros à esquerda
                                 const num =
                                    val === "" ? undefined : Number(val);
                                 field.onChange(num);
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={control}
                  name="maxUsers"
                  render={({ field }) => (
                     <FormItem className="flex-1 min-w-[120px]">
                        <FormLabel>Máx. Usuários</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type="string"
                              min={1}
                              placeholder="0"
                              className={clsx(
                                 touchedFields.maxUsers &&
                                    (errors.maxUsers
                                       ? "border-red-500"
                                       : "border-green-500")
                              )}
                              value={
                                 field.value !== undefined &&
                                 field.value !== null
                                    ? field.value
                                    : ""
                              }
                              onChange={(e) => {
                                 let val = e.target.value;
                                 val = val.replace(/^0+(?!$)/, "");
                                 const num =
                                    val === "" ? undefined : Number(val);
                                 field.onChange(num);
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={control}
                  name="maxClasses"
                  render={({ field }) => (
                     <FormItem className="flex-1 min-w-[120px]">
                        <FormLabel>Máx. Turmas</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              type="string"
                              min={0}
                              placeholder="0"
                              className={clsx(
                                 "text-right",
                                 touchedFields.maxClasses &&
                                    (errors.maxClasses
                                       ? "border-red-500"
                                       : "border-green-500")
                              )}
                              onChange={(e) => {
                                 let val = e.target.value;
                                 val = val.replace(/^0+(?!$)/, "");
                                 const num =
                                    val === "" ? undefined : Number(val);
                                 field.onChange(num);
                              }}
                              value={
                                 field.value !== undefined &&
                                 field.value !== null
                                    ? field.value
                                    : ""
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button type="submit" disabled={loading}>
               {loading ? <LoadingSpinnerCSS /> : <span>Criar Plano</span>}
            </Button>
         </form>
      </Form>
   );
}
