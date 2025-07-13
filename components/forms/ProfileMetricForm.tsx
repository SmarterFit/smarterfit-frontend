import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectGroup,
   SelectLabel,
   SelectItem,
} from "@/components/ui/select";
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
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
import { metricTypeService } from "@/backend/modules/useraccess/services/metricTypesService"; // certifique-se do path correto
import type { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes"; // certifique-se do path correto
import {
   MetricDataRequestDTO,
   metricDataRequestSchema,
} from "@/backend/modules/useraccess/schemas/userMetricSchemas";

interface MetricFormProps {
   onSubmit: (data: MetricDataRequestDTO) => Promise<void>;
   loading: boolean;
}

export function MetricForm({ onSubmit, loading }: MetricFormProps) {
   const [metricTypes, setMetricTypes] = useState<MetricTypeResponseDTO[]>([]);
   const form = useForm<MetricDataRequestDTO>({
      resolver: zodResolver(metricDataRequestSchema),
      defaultValues: {
         metricType: "",
         source: "website",
         data: {
            // O valor agora é inicializado dentro do objeto 'data'
            value: undefined,
         },
      },
   });

   useEffect(() => {
      const fetchMetricTypes = async () => {
         try {
            const response = await metricTypeService.getAll();
            setMetricTypes(response);
         } catch (error) {
            console.error("Erro ao carregar tipos de métrica:", error);
         }
      };
      fetchMetricTypes();
   }, []);

   const localSubmit = async (data: MetricDataRequestDTO) => {
      await onSubmit(data);
      form.reset();
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(localSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <FormField
                  control={form.control}
                  name="metricType" // Corrigido de 'metricType' para 'name'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                        >
                           <FormControl>
                              <SelectTrigger className="w-full">
                                 <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectLabel>Métricas</SelectLabel>
                                 {metricTypes.map((metric) => (
                                    <SelectItem
                                       key={metric.id}
                                       value={metric.type}
                                    >
                                       {metric.type} ({metric.unit})
                                    </SelectItem>
                                 ))}
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="data.value" // Corrigido para refletir o aninhamento em 'data'
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Ex: 0,00"
                              inputMode="numeric"
                              value={
                                 field.value !== undefined
                                    ? Number(field.value)
                                         .toFixed(2)
                                         .replace(".", ",")
                                    : ""
                              }
                              onChange={(e) => {
                                 const raw = e.target.value.replace(/\D/g, "");
                                 field.onChange(Number(raw) / 100);
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
               {loading ? <LoadingSpinnerCSS /> : "Registrar Métrica"}
            </Button>
         </form>
      </Form>
   );
}
