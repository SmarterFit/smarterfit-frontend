"use client";

import { useEffect, useState } from "react";
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { TabsContent } from "@/components/ui/tabs";
import { SubscriptionResponseDTO } from "@/backend/modules/billing/types/subscriptionTypes";
import { subscriptionService } from "@/backend/modules/billing/services/subscriptionServices";
import { subscriptionUserService } from "@/backend/modules/billing/services/subscriptionUserServices";
import { ErrorToast } from "../toasts/Toasts";
import { SubscriptionStatusLabels } from "@/backend/common/enums/subscriptionStatusEnum";
import { SubscriptionInformation } from "./SubscriptionInformation";

export function MySubscriptionsTab() {
   const user = useUser();

   const [subscriptions, setSubscriptions] = useState<
      SubscriptionResponseDTO[] | null
   >(null);

   useEffect(() => {
      const fetchSubscriptions = async () => {
         if (!user) return;

         try {
            const [ownerSubs, participantSubs] = await Promise.all([
               subscriptionService.getAllByOwnerId(user.id),
               subscriptionUserService.getAllSubscriptionsByUserId(user.id),
            ]);

            // Remover duplicatas pelo id da assinatura
            const allSubsMap = new Map<string, SubscriptionResponseDTO>();

            [...ownerSubs, ...participantSubs].forEach((sub) => {
               allSubsMap.set(sub.id, sub);
            });

            setSubscriptions(Array.from(allSubsMap.values()));
         } catch (e: any) {
            ErrorToast(e.message);
            setSubscriptions([]);
         }
      };

      fetchSubscriptions();
   }, [user]);

   if (!user || subscriptions === null) {
      return (
         <TabsContent value="minhas" className="mt-4 flex flex-col gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Separator />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
         </TabsContent>
      );
   }

   return (
      <>
         {subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
               Você não possui nenhuma assinatura no momento.
            </p>
         ) : (
            <Accordion type="single" collapsible className="w-full">
               {subscriptions.map((sub) => (
                  <AccordionItem key={sub.id} value={sub.id}>
                     <AccordionTrigger>
                        <div>
                           {sub.plan.name}{" "}
                           <span className="ml-2 text-sm text-muted-foreground">
                              ({SubscriptionStatusLabels[sub.status]})
                           </span>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent>
                        <SubscriptionInformation
                           subscription={sub}
                           loggedUserId={user.id}
                        />
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
         )}
      </>
   );
}
