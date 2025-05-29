"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import clsx from "clsx";
import React from "react";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LoadingSpinnerCSS } from "../LoadingSpinner";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";

import {
   createTrainingGroupRequestSchema,
   CreateTrainingGroupRequestDTO,
} from "@/backend/modules/training-group/schemas/trainingGroupSchemas";
import {
   TrainingGroupType,
   TrainingGroupTypeLabels,
} from "@/backend/common/enums/trainingGroupEnum";
import { trainingGroupService } from "@/backend/modules/training-group/services/trainingGroupServices";

import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectGroup,
   SelectItem,
} from "../ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CreateTrainingGroupFormProps {
   ownerId: string;
}

export default function CreateTrainingGroupForm({
   ownerId,
}: CreateTrainingGroupFormProps) {
   const [loading, setLoading] = useState(false);

   const form = useForm<CreateTrainingGroupRequestDTO>({
      resolver: zodResolver(createTrainingGroupRequestSchema),
      mode: "onChange",
      defaultValues: {
         name: "",
         type: TrainingGroupType.PUBLIC,
         ownerId,
         startDate: undefined,
         endDate: undefined,
      },
   });

   const {
      control,
      handleSubmit,
      reset,
      setValue,
      formState: { errors, touchedFields },
   } = form;

   async function onSubmit(data: CreateTrainingGroupRequestDTO) {
      setLoading(true);
      try {
         await trainingGroupService.create(data);
         SuccessToast(
            "Grupo criado com sucesso!",
            "O grupo de treinamento foi criado."
         );
         reset({ ...data, name: "", startDate: undefined, endDate: undefined });
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao criar grupo");
      } finally {
         setLoading(false);
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
               {/* Nome */}
               <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Nome do Grupo</FormLabel>
                        <FormControl>
                           <Input
                              {...field}
                              placeholder="Nome do grupo"
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

               {/* Tipo com Select */}
               <FormField
                  control={control}
                  name="type"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Tipo de Grupo</FormLabel>
                        <FormControl>
                           <Select
                              onValueChange={field.onChange}
                              value={field.value}
                           >
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    {Object.values(TrainingGroupType).map(
                                       (type) => (
                                          <SelectItem key={type} value={type}>
                                             {TrainingGroupTypeLabels[type]}
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

               {/* Intervalo de Datas */}
               <FormField
                  control={control}
                  name="startDate"
                  render={({ field }) => {
                     // field.value is Date | undefined; endDate we'll get from form.getValues
                     const start = field.value;
                     const end = form.getValues("endDate");
                     const [month, setMonth] = useState(
                        start ? start.getMonth() : new Date().getMonth()
                     );
                     const [year, setYear] = useState(
                        start ? start.getFullYear() : new Date().getFullYear()
                     );

                     return (
                        <FormItem>
                           <FormLabel>Período (Início – Fim)</FormLabel>
                           <FormControl>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       variant="outline"
                                       className={clsx(
                                          "w-full text-left",
                                          (touchedFields.startDate ||
                                             touchedFields.endDate) &&
                                             (errors.startDate || errors.endDate
                                                ? "border-red-500 focus-visible:ring-red-500"
                                                : "border-green-500 focus-visible:ring-green-500")
                                       )}
                                    >
                                       {start && end
                                          ? `${format(
                                               start,
                                               "dd/MM/yyyy"
                                            )} – ${format(end, "dd/MM/yyyy")}`
                                          : "Selecione um período"}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-2">
                                    <Calendar
                                       mode="range"
                                       selected={{
                                          from: start,
                                          to: end,
                                       }}
                                       onSelect={(range) => {
                                          setValue(
                                             "startDate",
                                             range?.from as Date
                                          );
                                          setValue(
                                             "endDate",
                                             range?.to as Date
                                          );
                                       }}
                                       month={new Date(year, month)}
                                       onMonthChange={(date) => {
                                          setMonth(date.getMonth());
                                          setYear(date.getFullYear());
                                       }}
                                       locale={ptBR}
                                       autoFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     );
                  }}
               />
            </div>

            <Button
               type="submit"
               disabled={loading}
               className="w-full lg:w-full"
            >
               {loading ? <LoadingSpinnerCSS /> : "Criar Grupo"}
            </Button>
         </form>
      </Form>
   );
}
