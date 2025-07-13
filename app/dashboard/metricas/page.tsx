"use client";

import { BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { MetricsTab } from "@/components/metrics/MetricsTab";
import { TrainingTab } from "@/components/metrics/TrainingTab";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { ChallengeTab } from "@/components/metrics/ChallengeTab";

export default function Metrics() {
   const rawUserFromHook = useUser();

   const [user, setUser] = useState<UserResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (rawUserFromHook !== undefined) {
         setUser(rawUserFromHook);
      }
      setIsLoading(false);
   }, [rawUserFromHook]);

   return (
      <div className="w-full lg:max-w-6xl mx-auto flex flex-col gap-4">
         <div className="flex space-x-3 mb-6">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Métricas</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode acompanhar e gerenciar suas métricas,
                  treinamentos e desafios.
               </p>
            </div>
         </div>

         <Tabs defaultValue="metricas" className="w-full">
            <TabsList className="w-full">
               <TabsTrigger value="metricas">Minhas Métricas</TabsTrigger>
               <TabsTrigger value="treinamentos">Treinamentos</TabsTrigger>
               <TabsTrigger value="desafios">Desafios</TabsTrigger>
            </TabsList>

            <TabsContent value="metricas" className="mt-4 flex flex-col gap-4">
               <h2 className="text-xl font-semibold">Minhas Métricas</h2>
               <p className="text-muted-foreground">
                  Veja o desempenho e evolução das suas métricas ao longo do
                  tempo.
               </p>
               <Separator />
               <MetricsTab user={user} isLoading={isLoading} />
            </TabsContent>

            <TabsContent
               value="treinamentos"
               className="mt-4 flex flex-col gap-4"
            >
               <h2 className="text-xl font-semibold">Treinamentos</h2>
               <p className="text-muted-foreground">
                  Crie ou gerencie seus treinos com base nas suas metas.
               </p>
               <Separator />
               <TrainingTab user={user} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="desafios" className="mt-4 flex flex-col gap-4">
               <h2 className="text-xl font-semibold">Desafios</h2>
               <p className="text-muted-foreground">
                  Participe de desafios personalizados para manter a motivação.
               </p>
               <Separator />
               <ChallengeTab user={user} isLoading={isLoading} />
            </TabsContent>
         </Tabs>
      </div>
   );
}
