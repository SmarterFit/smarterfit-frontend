// components/TrainingGroupHeader.tsx

import React from "react";
import { Calendar, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { TrainingGroupResponseDTO } from "@/backend/modules/training-group/types/trainingGroupTypes";
import { TrainingGroupTypeLabels } from "@/backend/common/enums/trainingGroupEnum";

interface TrainingGroupHeaderProps {
   group: TrainingGroupResponseDTO;
   isAdmin: boolean;
   membersCount: number;
}

export function TrainingGroupHeader({
   group,
   isAdmin,
   membersCount,
}: TrainingGroupHeaderProps) {
   const start = group.startDate
      ? format(new Date(group.startDate), "dd 'de' MMMM yyyy", { locale: ptBR })
      : "Não informado";
   const end = group.endDate
      ? format(new Date(group.endDate), "dd 'de' MMMM yyyy", { locale: ptBR })
      : "Não informado";

   return (
      <section className="w-full mb-8 p-6 rounded-lg shadow-lg">
         {/* Linha 1: Nome, Tipo e Indicador Admin */}
         <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
               <h1 className="text-3xl font-bold">
                  {group.name}
               </h1>
               <Badge className="px-3 py-1 text-base font-medium">
                  {TrainingGroupTypeLabels[group.type]}
               </Badge>
            </div>
            {isAdmin && (
               <div className="flex items-center text-green-600 text-base gap-2">
                  <ShieldCheck size={20} />
                  <span className="font-semibold">Administrador</span>
               </div>
            )}
         </div>

         {/* Linha 2: Datas e Membros */}
         <div className="flex justify-between items-center text-gray-500 text-base mb-4">
            <div className="flex items-center gap-3">
               <Calendar size={20} />
               <span>{start}</span>
               <span className="font-semibold">—</span>
               <span>{end}</span>
            </div>
            <div className="flex items-center gap-3">
               <Users size={20} />
               <span>
                  {membersCount} {membersCount === 1 ? "membro" : "membros"}
               </span>
            </div>
         </div>

         {/* Descrição breve */}
         <p className="text-gray-500 text-base leading-relaxed">
            Gerencie seu grupo de treinamento de forma intuitiva: acompanhe
            pontuações, visualize membros, explore rankings e ajuste
            configurações conforme necessário.
         </p>
      </section>
   );
}
