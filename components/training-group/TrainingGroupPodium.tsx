import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainingGroupUserResponseDTO } from "@/backend/modules/training-group/types/trainingGroupUserTypes";

interface TrainingGroupPodiumProps {
   podium: [
      TrainingGroupUserResponseDTO | null,
      TrainingGroupUserResponseDTO | null,
      TrainingGroupUserResponseDTO | null
   ];
}

export function TrainingGroupPodium({ podium }: TrainingGroupPodiumProps) {
   const pointsArray = podium.map((member) => member?.points ?? 0);
   const maxPoints = Math.max(...pointsArray, 1);

   return (
      <Card className="w-full max-w-md mx-auto">
         <CardHeader>
            <CardTitle>Pódio</CardTitle>
         </CardHeader>

         <CardContent className="space-y-6">
            {/* Barras proporcionais */}
            <div className="flex justify-around items-end">
               {podium.map((member, idx) => {
                  const placement = `${idx + 1}º`;
                  const points = member?.points ?? 0;
                  const barHeight = (points / maxPoints) * 100;

                  return (
                     <div key={idx} className="flex flex-col items-center w-20">
                        <div
                           className="bg-blue-500 rounded-t-lg"
                           style={{
                              height: `${barHeight}px`,
                              width: `40px`,
                           }}
                        />
                        <span className="mt-1 text-xs text-gray-500">
                           {placement}
                        </span>
                     </div>
                  );
               })}
            </div>

            {/* Avatares e detalhes */}
            <div className="flex justify-around items-center">
               {podium.map((member, idx) => {
                  const name = member?.user.profile.fullName || "-";
                  const letter = name.charAt(0).toUpperCase();
                  const points = member?.points ?? 0;

                  return (
                     <div key={idx} className="flex flex-col items-center w-20">
                        <Avatar className="w-12 h-12">
                           <AvatarFallback>{letter}</AvatarFallback>
                        </Avatar>
                        <span className="mt-2 font-medium text-sm max-w-[64px] truncate text-center">
                           {name}
                        </span>
                        <span className="text-gray-600 text-xs">
                           {points} pts
                        </span>
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
}
