"use client";

import { subscriptionService } from "@/backend/modules/billing/services/subscriptionServices";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorToast } from "../toasts/Toasts";
import { Skeleton } from "../ui/skeleton";
import GymCheckInCard from "../cards/GymCheckInCard";
import { RoleType } from "@/backend/common/enums/rolesEnum";
import GymPresenceOverviewCard from "../cards/GymPresenceOverviewCard";

export default function DashboardMember() {
   const user = useUser();
   const router = useRouter();

   const [isUserSessionChecked, setIsUserSessionChecked] =
      useState<boolean>(false);

   const [hasActiveSubscription, setHasActiveSubscription] = useState<
      boolean | null
   >(null);
   const [isLoadingSubscription, setIsLoadingSubscription] =
      useState<boolean>(true);

   const [isUserOnlyMember, setIsUserOnlyMember] = useState<boolean | null>(
      null
   );
   const [isLoadingRole, setIsLoadingRole] = useState<boolean>(true);

   useEffect(() => {
      setIsUserSessionChecked(true);
   }, []);

   useEffect(() => {
      if (isUserSessionChecked && !user) {
         router.push("/");
      }
   }, [user, isUserSessionChecked, router]);

   useEffect(() => {
      if (user?.id) {
         setIsLoadingSubscription(true);
         const fetchSubscriptionStatus = async () => {
            const storedSubscriptionStatus = localStorage.getItem(
               `hasActiveSubscription`
            );
            if (storedSubscriptionStatus) {
               setHasActiveSubscription(storedSubscriptionStatus === "true");
               setIsLoadingSubscription(false);
            } else {
               try {
                  const isActive =
                     await subscriptionService.existsCurrentByParticipantId(
                        user.id
                     );
                  setHasActiveSubscription(isActive);
                  localStorage.setItem(
                     `hasActiveSubscription`,
                     String(isActive)
                  );
               } catch (e: any) {
                  ErrorToast(e.message);
                  setHasActiveSubscription(false);
               } finally {
                  setIsLoadingSubscription(false);
               }
            }
         };

         setIsLoadingRole(true);
         const checkUserRole = () => {
            const storedRoleStatus = localStorage.getItem(`isOnlyMember`);
            if (storedRoleStatus) {
               setIsUserOnlyMember(storedRoleStatus === "true");
               setIsLoadingRole(false);
            } else {
               const onlyMember = user.roles
                  ? user.roles.length === 1 && user.roles[0] === RoleType.MEMBER
                  : false;
               setIsUserOnlyMember(onlyMember);
               localStorage.setItem(`isOnlyMember`, String(onlyMember));
               setIsLoadingRole(false);
            }
         };

         fetchSubscriptionStatus();
         checkUserRole();
      } else {
         setIsLoadingSubscription(false);
         setIsLoadingRole(false);
      }
   }, [user]);

   if (
      !isUserSessionChecked ||
      (user && (isLoadingSubscription || isLoadingRole))
   ) {
      return (
         <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-10 w-full" />
         </div>
      );
   }

   // Se o usuário existe e todos os dados foram carregados
   if (user && hasActiveSubscription !== null && isUserOnlyMember !== null) {
      return (
         <div className="flex flex-row gap-4">
            <GymPresenceOverviewCard isOnlyMember={isUserOnlyMember} />
            <div className="flex flex-col gap-4">
               <GymCheckInCard
                  userId={user.id}
                  hasSubscriptionActive={hasActiveSubscription}
               />
            </div>
         </div>
      );
   }
   return (
      <div className="p-4">
         <Skeleton className="h-48 w-full" />
      </div>
   );
}
