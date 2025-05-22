import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartConfig } from "@/components/ui/chart";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";

interface WeightEvolutionChartProps {
   data: ProfileMetricResponseDTO[];
   config: ChartConfig;
}

export function WeightEvolutionChart({
   data,
   config,
}: WeightEvolutionChartProps) {
   const chartData = data.map((m) => ({
      date: new Date(m.createdAt).toLocaleDateString("pt-BR", {
         day: "2-digit",
         month: "2-digit",
      }),
      value: m.value,
   }));

   if (!chartData.length) return <p>Sem dados disponíveis</p>;

   return (
      <ChartContainer config={config} className="h-32 w-full">
         <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
               dataKey="date"
               tickLine={false}
               axisLine={false}
               tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
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
   );
}
