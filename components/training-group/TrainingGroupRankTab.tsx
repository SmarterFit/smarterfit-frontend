// components/TrainingGroupRankTab.tsx

"use client";

import React, { useEffect, useState } from "react";
import { trainingGroupUserService } from "@/backend/modules/training-group/services/trainingGroupUserServices";
import { Skeleton } from "@/components/ui/skeleton";
import { TrainingGroupPodium } from "./TrainingGroupPodium";
import { TrainingGroupRank } from "./TrainingGroupRank";
import { TrainingGroupUserResponseDTO } from "@/backend/modules/training-group/types/trainingGroupUserTypes";
import { ErrorToast } from "../toasts/Toasts";

interface TrainingGroupRankTabProps {
   groupId: string;
}

export function TrainingGroupRankTab({ groupId }: TrainingGroupRankTabProps) {
   const [rankList, setRankList] = useState<TrainingGroupUserResponseDTO[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      async function fetchRank() {
         try {
            const data =
               await trainingGroupUserService.getRankByTrainingGroupId(groupId);
            setRankList(data);
         } catch (e: any) {
            ErrorToast(e.message);
            setRankList([]);
         } finally {
            setLoading(false);
         }
      }
      fetchRank();
   }, [groupId]);

   if (loading) {
      return (
         <div className="flex flex-col lg:flex-row gap-6">
            <Skeleton className="h-64 lg:h-auto lg:w-1/3 rounded-lg" />
            <Skeleton className="h-96 lg:h-auto flex-1 rounded-lg" />
         </div>
      );
   }

   // Preparar podium: garantir 3 posições
   const podium: [
      TrainingGroupUserResponseDTO | null,
      TrainingGroupUserResponseDTO | null,
      TrainingGroupUserResponseDTO | null
   ] = [rankList[0] || null, rankList[1] || null, rankList[2] || null];

   return (
      <div className="flex flex-col lg:flex-row gap-6">
         <div className="lg:w-1/3">
            <TrainingGroupPodium podium={podium} />
         </div>
         <div className="flex-1">
            <TrainingGroupRank rankList={rankList} />
         </div>
      </div>
   );
}
