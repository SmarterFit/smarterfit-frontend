"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
   Form, // Importe o componente 'Form' do shadcn/ui, que funciona como o provedor de contexto.
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
import { metricTypeService } from "@/backend/modules/useraccess/services/metricTypesService";
import type { MetricTypeResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ClassUsersResponseDTO } from "@/backend/modules/classgroup/types/classGroupUserType";
import { classGroupUserService } from "@/backend/modules/classgroup/service/classGroupUserService";
import { MetricDataRequestDTO } from "@/backend/modules/useraccess/schemas/userMetricSchemas";

// Schema Zod para validação dos campos do formulário
const gradeFormSchema = z.object({
   userId: z
      .string({ required_error: "Selecione um aluno." })
      .uuid("Selecione um aluno válido."),
   grade: z.coerce
      .number({ invalid_type_error: "Digite uma nota válida." })
      .min(0, "A nota não pode ser negativa.")
      .max(10, "A nota não pode ser maior que 10."),
});

type GradeFormData = z.infer<typeof gradeFormSchema>;

interface GradeFormProps {
   onSubmit: (data: MetricDataRequestDTO) => Promise<void>;
   loading: boolean;
   classGroupId: string;
}

export function GradeForm({ onSubmit, loading, classGroupId }: GradeFormProps) {
   const [students, setStudents] = useState<ClassUsersResponseDTO[]>([]);

   const form = useForm<GradeFormData>({
      resolver: zodResolver(gradeFormSchema),
      defaultValues: {
         userId: undefined,
         grade: undefined,
      },
   });

   useEffect(() => {
      const fetchStudents = async () => {
         if (!classGroupId) return;
         try {
            const response =
               await classGroupUserService.getStudentsByClassGroupId(
                  classGroupId
               );
            setStudents(response);
         } catch (error) {
            console.error("Erro ao carregar alunos da turma:", error);
         }
      };

      fetchStudents();
   }, [classGroupId]);

   const localSubmit = async (formData: GradeFormData) => {
      const finalData: MetricDataRequestDTO = {
         metricType: "Nota",
         source: "website",
         data: {
            grade: formData.grade,
            userId: formData.userId,
            classGroupId,
            value: formData.grade.toString(),
         },
      };

      await onSubmit(finalData);
      form.reset();
   };

   // ====================================================================================
   // NOTA SOBRE O ERRO:
   // O erro "useFormContext(...) is null" ocorre quando um componente de formulário
   // (como <FormField>, <FormLabel>) é usado fora do provedor de contexto <Form>.
   // A pilha de erros indica que o problema está no componente pai (`MetricsTab.tsx`),
   // onde provavelmente existe um <FormLabel> ou similar fora de um provedor.
   //
   // A ESTRUTURA DESTE COMPONENTE ESTÁ CORRETA.
   //
   // A SOLUÇÃO é garantir que no arquivo `MetricsTab.tsx`, qualquer componente
   // de formulário esteja dentro de um <Form>...</Form> ou seja movido para
   // dentro deste componente `GradeForm`.
   // ====================================================================================

   return (
      // O componente <Form> (que é um FormProvider) deve envolver todo o formulário.
      <Form {...form}>
         <form onSubmit={form.handleSubmit(localSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Aluno</FormLabel>
                        <Select
                           onValueChange={field.onChange}
                           defaultValue={field.value}
                        >
                           <FormControl>
                              <SelectTrigger>
                                 <SelectValue placeholder="Selecione um aluno" />
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectLabel>Alunos</SelectLabel>
                                 {students.map((student) => (
                                    <SelectItem
                                       key={student.userId}
                                       value={student.userId}
                                    >
                                       {student.name}
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
                  name="grade"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Nota</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="Ex: 8,5"
                              inputMode="decimal"
                              {...field}
                              onChange={(e) => {
                                 const value = e.target.value.replace(",", ".");
                                 field.onChange(
                                    value === "" ? undefined : value
                                 );
                              }}
                              value={
                                 field.value !== undefined
                                    ? String(field.value).replace(".", ",")
                                    : ""
                              }
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               disabled={loading}
               className="w-full"
            >
               {loading ? <LoadingSpinnerCSS /> : "Registrar Nota"}
            </Button>
         </form>
      </Form>
   );
}
