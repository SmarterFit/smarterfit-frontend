import React from "react";
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
import {
   CreateProfileMetricRequestDTO,
   createProfileMetricSchema,
} from "@/backend/modules/useraccess/schemas/profileMetricSchemas";
import { ProfileMetricLabels } from "@/backend/common/enums/profileMetricEnum";

interface MetricFormProps {
   onSubmit: (data: CreateProfileMetricRequestDTO) => Promise<void>;
   loading: boolean;
}

export function MetricForm({ onSubmit, loading }: MetricFormProps) {
   const form = useForm<CreateProfileMetricRequestDTO>({
      resolver: zodResolver(createProfileMetricSchema),
      defaultValues: { type: undefined, value: undefined },
   });

   const localSubmit = async (data: CreateProfileMetricRequestDTO) => {
      await onSubmit(data);
      form.reset();
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(localSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
               <FormField
                  control={form.control}
                  name="type"
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
                                 {Object.entries(ProfileMetricLabels).map(
                                    ([key, label]) => (
                                       <SelectItem key={key} value={key}>
                                          {label}
                                       </SelectItem>
                                    )
                                 )}
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="value"
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
