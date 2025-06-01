"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrainingGroupResponseDTO } from "@/backend/modules/training-group/types/trainingGroupTypes";
import { TrainingGroupTypeLabels } from "@/backend/common/enums/trainingGroupEnum";
import { trainingGroupUserService } from "@/backend/modules/training-group/services/trainingGroupUserServices";
import { ErrorToast } from "../toasts/Toasts";

interface UserTrainingGroupsProps {
   userId: string;
}

export function UserTrainingGroups({ userId }: UserTrainingGroupsProps) {
   const [groups, setGroups] = useState<TrainingGroupResponseDTO[] | null>(
      null
   );
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      async function fetchGroups() {
         try {
            const data =
               await trainingGroupUserService.getAllTrainingGroupsByUserId(
                  userId
               );
            setGroups(data);
         } catch (e: any) {
            ErrorToast(e.message);
            setGroups([]);
         } finally {
            setLoading(false);
         }
      }
      fetchGroups();
   }, [userId]);

   if (loading) {
      return (
         <div className="grid gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
               <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
         </div>
      );
   }

   if (!groups || groups.length === 0) {
      return (
         <p className="text-center text-sm text-gray-500">
            Nenhum grupo encontrado.
         </p>
      );
   }

   return (
      <div className="flex flex-col gap-3">
         {groups.map((group) => (
            <Link
               key={group.id}
               href={`/dashboard/grupos/${group.slug}`}
               className="block"
            >
               <Card className="flex flex-row items-center justify-between p-4 hover:shadow-md transition-shadow rounded-lg">
                  <div className="flex flex-col">
                     <span className="font-medium text-base">{group.name}</span>
                     <Badge className="mt-1">
                        {TrainingGroupTypeLabels[group.type]}
                     </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                     <div>
                        <span className="font-semibold">Início:</span>{" "}
                        {group.startDate
                           ? new Date(group.startDate).toLocaleDateString()
                           : "—"}
                     </div>
                     <div>
                        <span className="font-semibold">Fim:</span>{" "}
                        {group.endDate
                           ? new Date(group.endDate).toLocaleDateString()
                           : "—"}
                     </div>
                  </div>
               </Card>
            </Link>
         ))}
      </div>
   );
}
