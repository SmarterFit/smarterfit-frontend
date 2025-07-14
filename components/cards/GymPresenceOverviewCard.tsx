"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ErrorToast, SuccessToast } from "@/components/toasts/Toasts";

import {
   format,
   startOfMonth,
   endOfMonth,
   parseISO,
   getDay,
   isWithinInterval,
   setHours,
   setMinutes,
   setSeconds,
   setMilliseconds,
   isValid,
   startOfDay, // Adicionado
   endOfDay, // Adicionado
} from "date-fns";
import { ptBR } from "date-fns/locale";
import clsx from "clsx";

import {
   AreaChart as RechartsAreaChart,
   Area,
   CartesianGrid,
   XAxis,
   ResponsiveContainer,
} from "recharts";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
   ChartConfig,
} from "@/components/ui/chart";

import { useForm } from "react-hook-form"; // Controller removido pois não está sendo usado no JSX
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { PresenceSnapshotResponseDTO } from "@/backend/modules/checkin/types/presenceSnapshotTypes";
import {
   FilterPresenceSnapshotRequestDTO,
   filterPresenceSnapshotRequestSchema,
} from "@/backend/modules/checkin/schemas/presenceSnapshotSchemas";
import { presenceSnapshotService } from "@/backend/modules/checkin/services/presenceSnapshotServices";

const filterFormClientSchema = z
   .object({
      startDate: z.date({
         required_error: "Data inicial é obrigatória.",
         invalid_type_error: "Data inicial inválida.",
      }),
      endDate: z.date({
         required_error: "Data final é obrigatória.",
         invalid_type_error: "Data final inválida.",
      }),
   })
   .refine(
      (data) => {
         if (data.startDate && data.endDate) {
            return endOfDay(data.endDate) >= startOfDay(data.startDate);
         }
         return true;
      },
      {
         message: "Data final deve ser igual ou após a data inicial.",
         path: ["endDate"],
      }
   );

type FilterFormClientData = z.infer<typeof filterFormClientSchema>;

interface GymPresenceOverviewCardProps {
   isOnlyMember: boolean;
}

const chartConfig: ChartConfig = {
   presenceCount: {
      label: "Pessoas",
      color: "#3b82f6",
   },
} satisfies ChartConfig;

export default function GymPresenceOverviewCard({
   isOnlyMember,
}: GymPresenceOverviewCardProps) {
   const [chartData, setChartData] = useState<PresenceSnapshotResponseDTO[]>(
      []
   );
   const [isLoadingChart, setIsLoadingChart] = useState(true);

   const [currentPresence, setCurrentPresence] =
      useState<PresenceSnapshotResponseDTO | null>(null);
   const [lastPresenceUpdate, setLastPresenceUpdate] = useState<string | null>(
      null
   );
   const [isLoadingCurrentPresence, setIsLoadingCurrentPresence] =
      useState(true);
   const [isGymOpen, setIsGymOpen] = useState(false);
   const [isProcessingReset, setIsProcessingReset] = useState(false);

   const form = useForm<FilterFormClientData>({
      resolver: zodResolver(filterFormClientSchema),
      defaultValues: {
         startDate: startOfMonth(new Date()),
         endDate: endOfMonth(new Date()),
      },
   });
   const {
      watch,
      setValue,
      formState: { errors, touchedFields },
      trigger,
   } = form;

   const selectedStartDate = watch("startDate");
   const selectedEndDate = watch("endDate");

   const checkGymOpenStatus = useCallback(() => {
      const now = new Date();
      const dayOfWeek = getDay(now);
      const openingTime = setMilliseconds(
         setSeconds(setMinutes(setHours(now, 6), 0), 0),
         0
      );
      const closingTime = setMilliseconds(
         setSeconds(setMinutes(setHours(now, 21), 59), 59),
         0
      );

      const open =
         dayOfWeek !== 0 &&
         isWithinInterval(now, { start: openingTime, end: closingTime });
      setIsGymOpen(open);
      return open;
   }, []);

   const fetchChartData = useCallback(
      async (userSelectedStartDate: Date, userSelectedEndDate: Date) => {
         if (!isValid(userSelectedStartDate) || !isValid(userSelectedEndDate)) {
            ErrorToast("Datas inválidas selecionadas para o filtro.");
            setIsLoadingChart(false);
            setChartData([]);
            return;
         }
         setIsLoadingChart(true);
         try {
            const apiStartDate = startOfDay(userSelectedStartDate);
            const apiEndDate = endOfDay(userSelectedEndDate);

            const paramsToValidate: FilterPresenceSnapshotRequestDTO = {
               startDate: apiStartDate.toISOString(),
               endDate: apiEndDate.toISOString(),
            };

            const validationResult =
               filterPresenceSnapshotRequestSchema.safeParse(paramsToValidate);

            if (!validationResult.success) {
               console.error(
                  "Falha na validação dos parâmetros do gráfico:",
                  validationResult.error.flatten().fieldErrors
               );
               const fieldErrors = validationResult.error.flatten().fieldErrors;
               const firstErrorMessage =
                  fieldErrors.startDate?.[0] ||
                  fieldErrors.endDate?.[0] ||
                  "Parâmetros de data inválidos para API.";
               ErrorToast(firstErrorMessage);
               setIsLoadingChart(false);
               setChartData([]);
               return;
            }

            const data = await presenceSnapshotService.filterByDate(
               validationResult.data
            );
            console.log(data);
            setChartData(data);
         } catch (error: any) {
            ErrorToast(error.message || "Erro ao carregar dados do gráfico.");
            setChartData([]);
         } finally {
            setIsLoadingChart(false);
         }
      },
      []
   );

   const fetchCurrentPresence = useCallback(
      async (forceApiCall: boolean = false) => {
         setIsLoadingCurrentPresence(true);
         checkGymOpenStatus();

         const fiveMinutes = 5 * 60 * 1000;
         const storedData = localStorage.getItem("lastPresenceSnapshot");

         if (storedData && !forceApiCall) {
            try {
               const { snapshot, fetchedAt } = JSON.parse(storedData);
               if (Date.now() - fetchedAt < fiveMinutes) {
                  setCurrentPresence(snapshot);
                  setLastPresenceUpdate(
                     format(new Date(fetchedAt), "HH:mm", { locale: ptBR })
                  );
                  setIsLoadingCurrentPresence(false);
                  return;
               }
            } catch (e) {
               localStorage.removeItem("lastPresenceSnapshot");
            }
         }

         try {
            const snapshot = await presenceSnapshotService.getLast();
            setCurrentPresence(snapshot);
            const now = Date.now();
            localStorage.setItem(
               "lastPresenceSnapshot",
               JSON.stringify({ snapshot, fetchedAt: now })
            );
            setLastPresenceUpdate(
               format(new Date(now), "HH:mm", { locale: ptBR })
            );
         } catch (error: any) {
            ErrorToast(error.message || "Erro ao buscar presença atual.");
            setCurrentPresence(null);
         } finally {
            setIsLoadingCurrentPresence(false);
         }
      },
      [checkGymOpenStatus]
   );

   useEffect(() => {
      if (
         selectedStartDate &&
         selectedEndDate &&
         isValid(selectedStartDate) &&
         isValid(selectedEndDate)
      ) {
         if (endOfDay(selectedEndDate) >= startOfDay(selectedStartDate)) {
            fetchChartData(selectedStartDate, selectedEndDate);
         } else {
            // Pode opcionalmente mostrar um erro do formulário aqui se a validação do Zod não for suficiente
            // ou se quiser feedback imediato sem esperar o submit/blur do Zod.
         }
      }
   }, [selectedStartDate, selectedEndDate, fetchChartData]);

   useEffect(() => {
      fetchCurrentPresence();
      const intervalId = setInterval(
         () => fetchCurrentPresence(true),
         5 * 60 * 1000
      );
      const gymStatusIntervalId = setInterval(checkGymOpenStatus, 60 * 1000);

      return () => {
         clearInterval(intervalId);
         clearInterval(gymStatusIntervalId);
      };
   }, [fetchCurrentPresence, checkGymOpenStatus]);

   const handleResetPresence = async () => {
      setIsProcessingReset(true);
      try {
         await presenceSnapshotService.resetPresence();
         SuccessToast(
            "Resetado com sucesso!",
            "Contagem de presença resetada com sucesso."
         );
         await fetchCurrentPresence(true);
      } catch (error: any) {
         ErrorToast(error.message || "Erro ao resetar presença.");
      } finally {
         setIsProcessingReset(false);
      }
   };

   const formattedChartData = chartData.map((item) => ({
      date: format(parseISO(item.createdAt), "dd/MM HH:mm", { locale: ptBR }),
      Pessoas: item.presenceCount,
   }));

   return (
      <Card className="w-full">
         <CardHeader>
            <CardTitle>Visão Geral da Presença</CardTitle>
            <CardDescription>
               Acompanhe o fluxo de pessoas no centro.
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
            {!isOnlyMember && (
               <div className="space-y-2">
                  <label
                     htmlFor="date-range-picker-trigger"
                     className="text-sm font-medium"
                  >
                     Filtrar Período do Gráfico:
                  </label>
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button
                           id="date-range-picker-trigger"
                           variant="outline"
                           className={clsx(
                              "w-full justify-start text-left font-normal",
                              (!selectedStartDate || !selectedEndDate) &&
                                 "text-muted-foreground",
                              (touchedFields.startDate ||
                                 touchedFields.endDate) &&
                                 (errors.startDate || errors.endDate)
                                 ? "border-red-500 focus-visible:ring-red-500"
                                 : touchedFields.startDate &&
                                   touchedFields.endDate &&
                                   !errors.startDate &&
                                   !errors.endDate
                                 ? "border-green-500 focus-visible:ring-green-500"
                                 : ""
                           )}
                        >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {selectedStartDate &&
                           selectedEndDate &&
                           isValid(selectedStartDate) &&
                           isValid(selectedEndDate) ? (
                              <>
                                 {format(selectedStartDate, "dd/MM/yy", {
                                    locale: ptBR,
                                 })}{" "}
                                 -{" "}
                                 {format(selectedEndDate, "dd/MM/yy", {
                                    locale: ptBR,
                                 })}
                              </>
                           ) : (
                              <span>Selecione um período</span>
                           )}
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                           mode="range"
                           selected={{
                              from: selectedStartDate,
                              to: selectedEndDate,
                           }}
                           onSelect={(range) => {
                              const newStart = range?.from;
                              const newEnd = range?.to;

                              setValue(
                                 "startDate",
                                 newStart || startOfMonth(new Date()),
                                 { shouldTouch: true, shouldValidate: true }
                              );
                              setValue(
                                 "endDate",
                                 newEnd ||
                                    (newStart
                                       ? endOfDay(newStart)
                                       : endOfMonth(new Date())),
                                 { shouldTouch: true, shouldValidate: true }
                              );
                              trigger(["startDate", "endDate"]); // Força a revalidação
                           }}
                           defaultMonth={selectedStartDate || new Date()}
                           locale={ptBR}
                           disabled={(date) =>
                              date > new Date() || date < new Date("2000-01-01")
                           }
                        />
                     </PopoverContent>
                  </Popover>
                  {(errors.startDate || errors.endDate) && (
                     <p className="text-sm text-red-500">
                        {errors.startDate?.message || errors.endDate?.message}
                     </p>
                  )}
               </div>
            )}

            <div>
               {isLoadingChart ? (
                  <Skeleton className="h-64 w-full" />
               ) : chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <RechartsAreaChart
                           data={formattedChartData}
                           margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                           accessibilityLayer
                        >
                           <CartesianGrid
                              vertical={false}
                              strokeDasharray="3 3"
                           />
                           <XAxis
                              dataKey="date"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              tickFormatter={(value) => value.split(" ")[0]}
                              interval="preserveStartEnd"
                              minTickGap={30}
                           />
                           <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="dot" />}
                           />
                           <Area
                              dataKey="Pessoas" // Chave correspondente em formattedChartData
                              type="natural"
                              fill={chartConfig.presenceCount.color}
                              fillOpacity={0.4}
                              stroke={chartConfig.presenceCount.color}
                              strokeWidth={2}
                              stackId="a"
                           />
                        </RechartsAreaChart>
                     </ResponsiveContainer>
                  </ChartContainer>
               ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">
                     Sem dados de presença para o período selecionado.
                  </p>
               )}
            </div>

            <Separator />

            <div className="text-center">
               {isLoadingCurrentPresence ? (
                  <Skeleton className="h-8 w-1/2 mx-auto mb-1" />
               ) : isGymOpen ? (
                  currentPresence !== null ? (
                     <>
                        <p className="text-2xl font-bold">
                           {currentPresence.presenceCount}
                        </p>
                        <p className="text-sm text-muted-foreground">
                           pessoas no centro agora.
                        </p>
                        {lastPresenceUpdate && (
                           <p className="text-xs text-muted-foreground">
                              Última atualização: {lastPresenceUpdate}
                           </p>
                        )}
                     </>
                  ) : (
                     <p className="text-lg text-muted-foreground">
                        Não foi possível obter a presença atual.
                     </p>
                  )
               ) : (
                  <p className="text-lg font-semibold text-orange-600">
                     Centro fechado.
                  </p>
               )}
            </div>

            {!isOnlyMember && (
               <>
                  <Separator />
                  <Button
                     onClick={handleResetPresence}
                     disabled={isProcessingReset}
                     className="w-full"
                     variant="destructive"
                  >
                     {isProcessingReset
                        ? "Resetando..."
                        : "Resetar Contagem de Presença Atual"}
                  </Button>
               </>
            )}
         </CardContent>
      </Card>
   );
}
