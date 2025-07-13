"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// --- Types (assumindo caminhos) ---
import { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ChallengeTypeResponseDTO } from "@/backend/framework/challenge/types/challengeTypes";
import { DayOfWeek, DayOfWeekLabels } from "@/backend/common/enums/dayOfWeekEnum";
import { ExperienceLevel, ExperienceLevelLabels } from "@/backend/common/enums/experienceLevelEnum";

interface ChallengeQuestFormBaseProps {
   metricTypes: MetricTypeResponseDTO[];
   challengeTypes: ChallengeTypeResponseDTO[];
   children: React.ReactNode; // Para passar os botões do footer
}

// Este é o componente base reutilizável. Ele não tem estado próprio.
export function ChallengeQuestFormBase({
   metricTypes,
   challengeTypes,
   children,
}: ChallengeQuestFormBaseProps) {
   const form = useFormContext(); // Obtém o controle do formulário do componente pai

   return (
      <>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
               control={form.control}
               name="title"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Título</FormLabel>
                     <FormControl>
                        <Input placeholder="Ex: Correr 5km" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="metricTypeId"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Métrica Associada</FormLabel>
                     <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                     >
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Selecione uma métrica" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {metricTypes.map((metric) => (
                              <SelectItem key={metric.id} value={metric.id}>
                                 {metric.type} ({metric.unit})
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
         <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                     <Textarea
                        placeholder="Descreva o objetivo da missão..."
                        {...field}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
               control={form.control}
               name="challengeType"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Tipo de Desafio</FormLabel>
                     <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                     >
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Selecione um tipo" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {challengeTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>
                                 {type.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
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
                     <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                     >
                        <FormControl>
                           <SelectTrigger>
                              <SelectValue placeholder="Selecione o nível" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {Object.values(ExperienceLevel).map((level) => (
                              <SelectItem key={level} value={level}>
                                 {ExperienceLevelLabels[level]}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
               control={form.control}
               name="startDate"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>Data de Início</FormLabel>
                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button
                                 variant={"outline"}
                                 className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                 )}
                              >
                                 {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                 ) : (
                                    <span>Escolha uma data</span>
                                 )}
                                 <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
            <FormField
               control={form.control}
               name="endDate"
               render={({ field }) => (
                  <FormItem className="flex flex-col">
                     <FormLabel>Data de Término</FormLabel>
                     <Popover>
                        <PopoverTrigger asChild>
                           <FormControl>
                              <Button
                                 variant={"outline"}
                                 className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                 )}
                              >
                                 {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                 ) : (
                                    <span>Escolha uma data</span>
                                 )}
                                 <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                           </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
         </div>
         <FormField
            control={form.control}
            name="daysOfWeek"
            render={() => (
               <FormItem>
                  <div className="mb-4">
                     <FormLabel>Dias da Semana</FormLabel>
                     <FormDescription>
                        Selecione os dias em que a missão deve ser realizada.
                     </FormDescription>
                  </div>
                  <div className="flex flex-wrap gap-4">
                     {Object.values(DayOfWeek).map((day) => (
                        <FormField
                           key={day}
                           control={form.control}
                           name="daysOfWeek"
                           render={({ field }) => (
                              <FormItem
                                 key={day}
                                 className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                 <FormControl>
                                    <Checkbox
                                       checked={field.value?.includes(day)}
                                       onCheckedChange={(checked) => {
                                          return checked
                                             ? field.onChange([
                                                  ...(field.value || []),
                                                  day,
                                               ])
                                             : field.onChange(
                                                  field.value?.filter(
                                                     (value: DayOfWeek) =>
                                                        value !== day
                                                  )
                                               );
                                       }}
                                    />
                                 </FormControl>
                                 <FormLabel className="font-normal">
                                    {DayOfWeekLabels[day]}
                                 </FormLabel>
                              </FormItem>
                           )}
                        />
                     ))}
                  </div>
                  <FormMessage />
               </FormItem>
            )}
         />
         {children}
      </>
   );
}
