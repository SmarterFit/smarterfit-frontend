import React from "react";
import { BarChart, Bar, XAxis } from "recharts";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartConfig } from "@/components/ui/chart";
import { MetricDataResponseDTO } from "@/backend/modules/useraccess/types/userMetricTypes";

interface LastMetricsChartProps {
   data: MetricDataResponseDTO[];
   config: ChartConfig;
}

export function LastMetricsChart({ data, config }: LastMetricsChartProps) {
   const lastData = data.map((m) => ({
      label: m.metricType,
      value: m.data.Nota,
   }));

   if (!lastData.length) return <p>Sem dados disponíveis</p>;

   return (
      <ChartContainer config={config} className="h-32 w-full">
         <BarChart data={lastData} accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent />} />
            <XAxis
               dataKey="label"
               tickLine={false}
               tickMargin={10}
               axisLine={false}
               tickFormatter={(value) =>
                  typeof value === "string" ? value.split(" ")[0] : ""
               }
            />
            <Bar dataKey="value" fill="#3b82f6" />
         </BarChart>
      </ChartContainer>
   );
}
