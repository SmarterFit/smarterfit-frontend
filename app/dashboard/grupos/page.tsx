"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainingGroupManagerTab from "@/components/training-group/TrainingGroupManagerTab";

export default function GruposDeTreinamento() {
   const rawUserFromHook = useUser();
   const [user, setUser] = useState<UserResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (rawUserFromHook !== undefined) {
         setUser(rawUserFromHook);
         setIsLoading(false);
      }
   }, [rawUserFromHook]);

   if (isLoading || !user) {
      return <Skeleton className="h-48 w-full mx-auto" />;
   }

   return (
      <div className="w-full lg:max-w-4xl mx-auto flex flex-col gap-4">
         {/* Título e Descrição */}
         <div className="flex space-x-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Grupos de Treinamento</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode criar, visualizar e gerenciar todos os grupos
                  de treinamento disponíveis no sistema.
               </p>
            </div>
         </div>

         {/* Abas */}
         <Tabs defaultValue="meus-grupos">
            <TabsList className="w-full">
               <TabsTrigger value="meus-grupos">Meus grupos</TabsTrigger>
               <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
            </TabsList>

            <TabsContent value="meus-grupos">
               <p className="text-center py-10">Em breve...</p>
            </TabsContent>

            <TabsContent value="gerenciar">
               <TrainingGroupManagerTab userId={user.id} />
            </TabsContent>
         </Tabs>
      </div>
   );
}
