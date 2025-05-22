import React from "react";
import { BarChart, Bar, XAxis } from "recharts";
import {
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartConfig } from "@/components/ui/chart";
import { ProfileMetricResponseDTO } from "@/backend/modules/useraccess/types/profileMetricTypes";
import { ProfileMetricLabels } from "@/backend/common/enums/profileMetricEnum";

interface LastMetricsChartProps {
   data: ProfileMetricResponseDTO[];
   config: ChartConfig;
}

export function LastMetricsChart({ data, config }: LastMetricsChartProps) {
   const lastData = data.map((m) => ({
      label: ProfileMetricLabels[m.type],
      value: m.value,
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
               tickFormatter={(value) => value.split(" ")[0]}
            />
            <Bar dataKey="value" fill="#3b82f6" />
         </BarChart>
      </ChartContainer>
   );
}
