"use client";

import React, { useEffect, useState } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { profileMetricService } from "@/backend/modules/useraccess/services/profileMetricServices";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";
import { toast } from "sonner";
import { LastMetricsChart } from "../charts/LastMetricsChart";
import { WeightEvolutionChart } from "../charts/WeightEvolutionChart";
import { MetricForm } from "../forms/ProfileMetricForm";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProfileMetricRequestDTO } from "@/backend/modules/useraccess/schemas/profileMetricSchemas";
import { ChartConfig } from "../ui/chart";
import GymPresenceCard from "../cards/GymCheckInCard";

export default function DashboardMember() {
   const user = useUser();
   const [allMetrics, setAllMetrics] = useState<
      ProfileMetricResponseDTO[] | null
   >(null);
   const [weightMetrics, setWeightMetrics] = useState<
      ProfileMetricResponseDTO[] | null
   >(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!user) return;
      const id = user.id;
      profileMetricService.getLasts(id).then((data) => setAllMetrics(data));
      profileMetricService
         .getByType(id, ProfileMetricType.WEIGHT)
         .then((data) => setWeightMetrics(data));
   }, [user]);

   async function handleMetricSubmit(data: CreateProfileMetricRequestDTO) {
      if (!user) return;
      setLoading(true);
      try {
         await profileMetricService.create(user.id, data);
         toast.success("Nova métrica criada! Seus dados estão bem guardados!");
         window.location.reload();
      } catch (err: any) {
         toast.error("Ops, algo deu errado: " + err.message);
      } finally {
         setLoading(false);
      }
   }

   const chartConfig: ChartConfig = {};

   const lastMetricDate =
      allMetrics && allMetrics[0]
         ? new Date(allMetrics[0].createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
           })
         : null;

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
                  {allMetrics ? (
                     <LastMetricsChart data={allMetrics} config={chartConfig} />
                  ) : (
                     <Skeleton className="h-32 w-full" />
                  )}
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
                  {weightMetrics ? (
                     <WeightEvolutionChart
                        data={weightMetrics}
                        config={chartConfig}
                     />
                  ) : (
                     <Skeleton className="h-32 w-full" />
                  )}
               </CardContent>
            </Card>

            {/* MiniCard 3: Adicionar Métrica */}
            <Card>
               <CardHeader>
                  <CardTitle>Registre novas Métricas</CardTitle>
                  <CardDescription>
                     {lastMetricDate
                        ? `Você não registra novas métricas desde ${lastMetricDate}!`
                        : `Você nunca registrou novas métricas!`}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  {user ? (
                     <MetricForm
                        onSubmit={handleMetricSubmit}
                        loading={loading}
                     />
                  ) : (
                     <div className="space-y-4">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-10 w-full" />
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <GymPresenceCard />
         </div>
      </div>
   );
}
