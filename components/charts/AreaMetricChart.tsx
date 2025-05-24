import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartConfig } from "@/components/ui/chart";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";

interface AreaMetricChartProps {
   data: ProfileMetricResponseDTO[];
   config: ChartConfig;
   color?: string;
   height?: string;
   width?: string;
}

export function AreaMetricChart({
   data,
   config,
   color = "#3b82f6",
   height = "h-32",
   width = "w-full",
}: AreaMetricChartProps) {
   const chartData = data.map((m) => ({
      date: new Date(m.createdAt).toLocaleDateString("pt-BR", {
         day: "2-digit",
         month: "2-digit",
      }),
      value: m.value,
   }));

   if (!chartData.length)
      return (
         <p className="text-sm text-muted-foreground">Sem dados disponíveis</p>
      );

   return (
      <ChartContainer config={config} className={`${height} ${width}`}>
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
               fill={color}
               fillOpacity={0.4}
               stroke={color}
               stackId="a"
            />
         </AreaChart>
      </ChartContainer>
   );
}
