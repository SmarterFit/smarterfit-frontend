import React, { useEffect } from "react";
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
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
import {
   MetricDataRequestDTO,
   metricDataRequestSchema,
} from "@/backend/modules/useraccess/schemas/userMetricSchemas";
import { useUser } from "@/hooks/useUser";

interface MetricFormProps {
   onSubmit: (data: MetricDataRequestDTO) => Promise<void>;
   loading: boolean;
}

export function MetricForm({ onSubmit, loading }: MetricFormProps) {
   const user = useUser();
   const form = useForm<MetricDataRequestDTO>({
      resolver: zodResolver(metricDataRequestSchema),
      // AJUSTE 1: Habilita a validação em tempo real para o formState.isValid
      mode: "onChange",
      defaultValues: {
         metricType: "Créditos de Educação",
         source: "website",
         data: {
            hours: undefined,
            courseName: "",
            institution: "",
            completionDate: undefined,
         },
      },
   });

   useEffect(() => {
      if (user?.id) {
         // Adicionar { shouldValidate: true } garante que a validade do formulário
         // seja recalculada assim que o ID do usuário for definido.
         form.setValue("data.userId", user.id, { shouldValidate: true });
      }
   }, [user, form]); // A dependência em `form` é segura aqui.

   const localSubmit = async (data: MetricDataRequestDTO) => {
      await onSubmit(data);
      form.reset();
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(localSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Seus FormFields estão corretos */}
               <FormField
                  control={form.control}
                  name="data.hours"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Horas de Curso</FormLabel>
                        <FormControl>
                           <Input
                              type="number"
                              placeholder="Ex: 40"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="data.completionDate"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Data de Conclusão</FormLabel>
                        <FormControl>
                           <Input
                              type="date"
                              {...field}
                              value={
                                 field.value
                                    ? typeof field.value === "string"
                                       ? field.value
                                       : new Date(field.value)
                                            .toISOString()
                                            .split("T")[0]
                                    : ""
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="data.courseName"
                  render={({ field }) => (
                     <FormItem className="sm:col-span-2">
                        <FormLabel>Nome do Curso</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Ex: React - O Guia Completo"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="data.institution"
                  render={({ field }) => (
                     <FormItem className="sm:col-span-2">
                        <FormLabel>Instituição de Ensino</FormLabel>
                        <FormControl>
                           <Input placeholder="Ex: Udemy" {...field} />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               // AJUSTE 2: Desativa o botão se estiver carregando OU se o formulário for inválido.
               disabled={loading || !form.formState.isValid}
               className="w-full"
            >
               {loading ? <LoadingSpinnerCSS /> : "Registrar Créditos"}
            </Button>
         </form>
      </Form>
   );
}
