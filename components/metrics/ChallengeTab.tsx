"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import {
   Table,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from "@/components/ui/card";

// --- Services and Types (assumindo caminhos) ---
import { ChallengeQuestResponseDTO } from "@/backend/modules/challenge/types/challengeQuestTypes";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes"; // Assumindo o tipo de usuário
import { challengeQuestService } from "@/backend/modules/challenge/services/challengeQuestServices";
import { CreateChallengeQuest } from "../forms/CreateChallengeQuestForm";
import { DayOfWeekAbbreviations } from "@/backend/common/enums/dayOfWeekEnum";
import { ExperienceLevelLabels } from "@/backend/common/enums/experienceLevelEnum";
import { useRouter } from "next/navigation";

// --- Props Interface ---
interface ChallengeTabProps {
   user?: UserResponseDTO | null;
   isLoading?: boolean;
}

export function ChallengeTab({
   user,
   isLoading: isUserLoading,
}: ChallengeTabProps) {
   const [quests, setQuests] = useState<ChallengeQuestResponseDTO[]>([]);
   const [isLoadingQuests, setIsLoadingQuests] = useState(true);
   const router = useRouter();

   useEffect(() => {
      async function fetchQuests() {
         if (!user) return;
         setIsLoadingQuests(true);
         try {
            const userQuests =
               await challengeQuestService.getAllChallengeQuestByProfile();
            setQuests(userQuests);
         } catch (error) {
            console.error("Failed to fetch quests:", error);
         } finally {
            setIsLoadingQuests(false);
         }
      }

      fetchQuests();
   }, [user]);

   if (isUserLoading) {
      return <Skeleton className="h-64 w-full" />;
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h2 className="text-2xl font-bold tracking-tight">
                  Gerenciamento de Missões
               </h2>
               <p className="text-muted-foreground">
                  Crie e visualize as missões de desafio disponíveis.
               </p>
            </div>
            <CreateChallengeQuest setQuests={setQuests} />
         </div>

         <Card>
            <CardHeader>
               <CardTitle>Lista de Missões</CardTitle>
               <CardDescription>
                  Visualize todas as missões cadastradas.
               </CardDescription>
            </CardHeader>
            <CardContent>
               {isLoadingQuests ? (
                  <div className="space-y-2">
                     <Skeleton className="h-8 w-full" />
                     <Skeleton className="h-8 w-full" />
                     <Skeleton className="h-8 w-full" />
                  </div>
               ) : (
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Título</TableHead>
                           <TableHead>Métrica</TableHead>
                           <TableHead>Tipo</TableHead>
                           <TableHead>Nível</TableHead>
                           <TableHead>Período</TableHead>
                           <TableHead>Dias</TableHead>
                           <TableHead>Ações</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {quests.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={7} className="text-center">
                                 Nenhuma missão encontrada.
                              </TableCell>
                           </TableRow>
                        ) : (
                           quests.map((quest) => (
                              <TableRow key={quest.id}>
                                 <TableCell className="font-medium">
                                    {quest.title}
                                 </TableCell>
                                 <TableCell>{quest.metricType.type}</TableCell>
                                 <TableCell>
                                    {quest.challengeType.name}
                                 </TableCell>
                                 <TableCell>
                                    {
                                       ExperienceLevelLabels[
                                          quest.experienceLevel
                                       ]
                                    }
                                 </TableCell>
                                 <TableCell>
                                    {format(
                                       new Date(quest.startDate),
                                       "dd/MM/yy",
                                       { locale: ptBR }
                                    )}{" "}
                                    -{" "}
                                    {format(
                                       new Date(quest.endDate),
                                       "dd/MM/yy",
                                       { locale: ptBR }
                                    )}
                                 </TableCell>
                                 <TableCell>
                                    {quest.daysOfWeek
                                       .map((day) =>
                                          DayOfWeekAbbreviations[
                                             day as keyof typeof DayOfWeekAbbreviations
                                          ].slice(0, 3)
                                       )
                                       .join(", ")}
                                 </TableCell>
                                 <TableCell>
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() =>
                                          router.push(
                                             `/dashboard/desafios/${quest.id}`
                                          )
                                       }
                                    >
                                       Detalhes
                                    </Button>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
