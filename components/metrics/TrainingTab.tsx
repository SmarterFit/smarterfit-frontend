import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { TrainingGoalForm } from "../forms/TrainingGoalForm";

interface TrainingTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
}

export const TrainingTab: React.FC<TrainingTabProps> = ({
   user,
   isLoading,
}) => {
   if (isLoading || !user) {
      return (
         <div className="space-y-8">
            <section className="flex flex-col space-y-4 p-6 border rounded-lg">
               <Skeleton className="h-8 w-1/3" />
               <Skeleton className="h-4 w-2/3" />
               <Skeleton className="h-40 w-full" />
            </section>
         </div>
      );
   }

   return (
      <div className="space-y-8">
         <section className="flex flex-col space-y-6 p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold">Objetivo de Treino</h2>
            <p className="text-muted-foreground text-sm">
               Defina ou atualize seu objetivo de treinamento.
            </p>
            <TrainingGoalForm />
         </section>
      </div>
   );
};
