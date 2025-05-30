// app/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { trainingGroupService } from "@/backend/modules/training-group/services/trainingGroupServices";
import { trainingGroupUserService } from "@/backend/modules/training-group/services/trainingGroupUserServices";
import { ErrorToast } from "@/components/toasts/Toasts";
import { TrainingGroupHeader } from "@/components/training-group/TrainingGroupHeader";
import { TrainingGroupRankTab } from "@/components/training-group/TrainingGroupRankTab";
import { TrainingGroupResponseDTO } from "@/backend/modules/training-group/types/trainingGroupTypes";
import { TrainingGroupUserResponseDTO } from "@/backend/modules/training-group/types/trainingGroupUserTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrainingGroupMembers } from "@/components/training-group/TrainingGroupMembers";
import { TrainingGroupSettings } from "@/components/training-group/TrainingGroupSettings";

export default function TrainingGroupPage() {
   const router = useRouter();
   const { slug } = useParams<{ slug: string }>();
   const user = useUser();

   const [loading, setLoading] = useState(true);
   const [group, setGroup] = useState<TrainingGroupResponseDTO | null>(null);
   const [members, setMembers] = useState<TrainingGroupUserResponseDTO[]>([]);
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      if (!user || !slug) return;

      async function init() {
         try {
            const groupData = await trainingGroupService.getBySlug(slug);
            const membersData =
               await trainingGroupUserService.getAllUsersByTrainingGroupId(
                  groupData.id
               );

            const membership = user
               ? membersData.find((m) => m.user.id === user.id)
               : false;
            if (!membership) {
               router.push("/dashboard");
               return;
            }

            setGroup(groupData);
            setMembers(membersData);
            if (membership.isAdmin) setIsAdmin(true);
         } catch (e: any) {
            ErrorToast(e.message);
            router.push("/dashboard");
            return;
         } finally {
            setLoading(false);
         }
      }

      init();
   }, [user, slug, router]);

   if (loading || !group || !user) {
      return (
         <div className="space-y-2 p-4">
            <Skeleton className="h-8 w-1/3 rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
         </div>
      );
   }

   return (
      <div className="w-full lg:max-w-4xl mx-auto flex flex-col gap-6">
         <TrainingGroupHeader
            group={group}
            isAdmin={isAdmin}
            membersCount={members.length}
         />

         <Tabs defaultValue="rank" className="w-full">
            <TabsList className="w-full">
               <TabsTrigger value="rank">Rank</TabsTrigger>
               <TabsTrigger value="members">Membros</TabsTrigger>
               {isAdmin && (
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
               )}
            </TabsList>

            <TabsContent value="rank" className="mt-4">
               <TrainingGroupRankTab groupId={group.id} />
            </TabsContent>

            <TabsContent value="members" className="mt-4">
               <TrainingGroupMembers
                  currentUserId={user.id}
                  groupId={group.id}
                  initialMembers={members}
                  isCurrentUserAdmin={isAdmin}
               />
            </TabsContent>

            {isAdmin && (
               <TabsContent value="settings" className="mt-4">
                  {group && (
                     <TrainingGroupSettings
                        initialData={group}
                        onChange={(updatedGroup) => {
                           if (updatedGroup) {
                              setGroup(updatedGroup);
                           }
                        }}
                     />
                  )}
               </TabsContent>
            )}
         </Tabs>
      </div>
   );
}
