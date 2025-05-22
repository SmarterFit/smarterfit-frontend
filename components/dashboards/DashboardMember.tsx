"use client";
import React, { useEffect, useState } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardContent,
   CardDescription,
} from "@/components/ui/card";
import { BarChart, Bar, CartesianGrid, XAxis, AreaChart, Area } from "recharts";
import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { useUser } from "@/hooks/useUser";
import { profileMetricService } from "@/backend/modules/useraccess/services/profileMetricServices";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";
import { ProfileMetricLabels } from "@/backend/common/enums/profileMetricEnum";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";
import {
   CreateProfileMetricRequestDTO,
   createProfileMetricSchema,
} from "@/backend/modules/useraccess/schemas/profileMetricSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
   Select,
   SelectTrigger,
   SelectValue,
   SelectContent,
   SelectItem,
   SelectGroup,
   SelectLabel,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormControl,
   FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { withMask } from "use-mask-input";

export default function DashboardMember() {
   const user = useUser();
   const [allMetrics, setAllMetrics] = useState<
      ProfileMetricResponseDTO[] | null
   >(null);
   const [weightMetrics, setWeightMetrics] = useState<
      ProfileMetricResponseDTO[] | null
   >(null);
   const metricForm = useForm<CreateProfileMetricRequestDTO>({
      resolver: zodResolver(createProfileMetricSchema),
      defaultValues: { type: undefined, value: undefined },
   });
   const [metricRegisterLoading, setMetricRegisterLoading] = useState(false);

   useEffect(() => {
      if (!user) return;
      const profileId = user.id;
      profileMetricService.getLasts(profileId).then(setAllMetrics);
      profileMetricService
         .getByType(profileId, ProfileMetricType.WEIGHT)
         .then(setWeightMetrics);
   }, [user]);

   async function onSubmit(data: CreateProfileMetricRequestDTO) {
      if (!user) return;

      setMetricRegisterLoading(true);
      try {
         await profileMetricService.create(user.id, data);
         toast("Nova métrica criada!", {
            description: "Seus dados estão bem guardados!",
            closeButton: true,
         });

         window.location.reload();
      } catch (e: any) {
         toast("Ops, algo deu errado!", {
            description: e.message,
            closeButton: true,
         });
      } finally {
         setMetricRegisterLoading(false);
      }
   }

   if (!user || !allMetrics || !weightMetrics) {
      return <LoadingSpinnerCSS />;
   }

   const chartConfig: ChartConfig = {};

   // Dados para últimos valores: cada métrica com label e valor
   const lastData = allMetrics.map((m) => ({
      label: ProfileMetricLabels[m.type],
      value: m.value,
   }));

   // Dados para gráfico de peso ao longo do tempo
   const chartData = weightMetrics.map((m) => ({
      date: new Date(m.createdAt).toLocaleDateString("pt-BR", {
         day: "2-digit",
         month: "2-digit",
      }),
      value: m.value,
   }));

   const dateFromLastMetric =
      allMetrics[0] &&
      new Date(allMetrics[0].createdAt).toLocaleDateString("pt-BR", {
         day: "2-digit",
         month: "long",
         year: "numeric",
      });

   return (
      <div className="w-full space-y-2">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            {/* MiniCard 1: Últimas Métricas */}
            <Card>
               <CardHeader>
                  <CardTitle>Últimas Métricas</CardTitle>
                  <CardDescription>
                     Suas últimas métricas pessoais!
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ChartContainer config={chartConfig} className="h-32 w-full">
                     <BarChart data={lastData} accessibilityLayer>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <XAxis
                           dataKey="label"
                           tickLine={false}
                           tickMargin={10}
                           axisLine={false}
                           tickFormatter={(value) => {
                              return value.split(" ")[0];
                           }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" />
                     </BarChart>
                  </ChartContainer>
               </CardContent>
            </Card>
            {/* MiniCard 2: Evolução do Peso */}
            <Card>
               <CardHeader>
                  <CardTitle>Evolução do Peso</CardTitle>
                  <CardDescription>
                     Evolução do seu peso ao longo do tempo!
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ChartContainer config={chartConfig} className="h-32 w-full">
                     <AreaChart data={chartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                           dataKey="date"
                           tickLine={false}
                           axisLine={false}
                           tickMargin={8}
                        />
                        <ChartTooltip
                           content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                           dataKey="value"
                           type="natural"
                           fill="#3b82f6"
                           fillOpacity={0.4}
                           stroke="#3b82f6"
                           stackId="a"
                        />
                     </AreaChart>
                  </ChartContainer>
               </CardContent>
            </Card>

            {/* MiniCard 3: Adicionar Métrica */}
            <Card>
               <CardHeader>
                  <CardTitle>Registre novas Métricas</CardTitle>
                  <CardDescription>
                     {dateFromLastMetric
                        ? `Você não registra novas métricas desde ${dateFromLastMetric}
                     !`
                        : `Você nunca registrou novas métricas!`}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Form {...metricForm}>
                     <form
                        onSubmit={metricForm.handleSubmit(onSubmit)}
                        className="space-y-4"
                     >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           {/* Select de tipo */}
                           <FormField
                              control={metricForm.control}
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
                                             {Object.entries(
                                                ProfileMetricLabels
                                             ).map(([metric, label]) => (
                                                <SelectItem
                                                   key={metric}
                                                   value={metric}
                                                >
                                                   {label}
                                                </SelectItem>
                                             ))}
                                          </SelectGroup>
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                           {/* Input de valor */}
                           <FormField
                              control={metricForm.control}
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
                                             const raw = e.target.value.replace(
                                                /\D/g,
                                                ""
                                             );
                                             const num = Number(raw) / 100;
                                             field.onChange(num);
                                          }}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        {/* Botão de submit */}
                        <Button
                           type="submit"
                           disabled={metricRegisterLoading}
                           className="w-full cursor-pointer
                           "
                        >
                           {metricRegisterLoading ? (
                              <LoadingSpinnerCSS />
                           ) : (
                              "Registrar Métrica"
                           )}
                        </Button>
                     </form>
                  </Form>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
