// components/TrainingGroupRank.tsx

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { TrainingGroupUserResponseDTO } from "@/backend/modules/training-group/types/trainingGroupUserTypes";

interface TrainingGroupRankProps {
   rankList: TrainingGroupUserResponseDTO[];
}

// Helper para ordinal (1 -> 1º, 2 -> 2º, etc.)
function toOrdinal(n: number) {
   return `${n}º`;
}

export function TrainingGroupRank({ rankList }: TrainingGroupRankProps) {
   return (
      <div className="overflow-x-auto">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {rankList.map((member, index) => {
                  const name = member.user.profile.fullName;
                  const letter = name.charAt(0).toUpperCase();
                  return (
                     <TableRow key={member.user.id}>
                        <TableCell className="w-8">
                           {toOrdinal(index + 1)}
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                 <AvatarFallback>{letter}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{name}</span>
                           </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                           {member.points}
                        </TableCell>
                     </TableRow>
                  );
               })}
            </TableBody>
         </Table>
      </div>
   );
}
