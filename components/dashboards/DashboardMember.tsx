"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
   BarChart,
   Bar,
   CartesianGrid,
   XAxis,
   YAxis,
   Tooltip as ReTooltip,
   ResponsiveContainer,
   LineChart,
   Line,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useUser } from "@/hooks/useUser";
import { profileMetricService } from "@/backend/modules/useraccess/services/profileMetricServices";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ProfileMetricType } from "@/backend/common/enums/profileMetricEnum";
import { ProfileMetricLabels } from "@/backend/common/enums/profileMetricEnum";
import { LoadingSpinnerCSS } from "@/components/LoadingSpinner";

export default function DashboardMember() {
   const user = useUser();
   const [allMetrics, setAllMetrics] = useState<
      ProfileMetricResponseDTO[] | null
   >(null);
   const [weightMetrics, setWeightMetrics] = useState<
      ProfileMetricResponseDTO[] | null
   >(null);

   useEffect(() => {
      if (!user) return;
      const profileId = user.id;
      profileMetricService.getLasts(profileId).then(setAllMetrics);
      profileMetricService
         .getByType(profileId, ProfileMetricType.WEIGHT)
         .then(setWeightMetrics);
   }, [user]);

   if (!user || !allMetrics || !weightMetrics) {
      return <LoadingSpinnerCSS />;
   }

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

   return (
      <div className="w-full space-y-2">
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            {/* MiniCard 1: Últimas Métricas */}
            <Card className="h-28 w-full">
               <CardHeader className="p-2">
                  <CardTitle className="text-xs">Últimas Métricas</CardTitle>
               </CardHeader>
               <CardContent className="p-0 h-full"></CardContent>
            </Card>

            {/* MiniCard 2: Evolução do Peso */}
            <Card className="h-28 w-full">
               <CardHeader className="p-2">
                  <CardTitle className="text-xs">Peso (evolução)</CardTitle>
               </CardHeader>
               <CardContent className="p-0 h-full"></CardContent>
            </Card>

            {/* MiniCard 3: Adicionar Métrica */}
            <Card className="h-28 w-full flex items-center justify-center">
               <CardContent className="p-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                     +
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
