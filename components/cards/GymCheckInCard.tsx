"use client";

import React, { useEffect, useState } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { gymCheckInService } from "@/backend/modules/checkin/services/gymCheckInServices";
import { presenceSnapshotService } from "@/backend/modules/checkin/services/presenceSnapshotServices";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

export default function GymPresenceCard() {
   const user = useUser();
   const [count, setCount] = useState<number | null>(null);
   const [lastUpdated, setLastUpdated] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
   const [processing, setProcessing] = useState(false);
   const [checkedIn, setCheckedIn] = useState<boolean>(() => {
      return localStorage.getItem("gymCheckedIn") === "true";
   });

   // Carrega dados iniciais de presença
   async function loadCount() {
      setLoading(true);
      try {
         const snapshot = await presenceSnapshotService.getLast();
         setCount(snapshot.presenceCount);
         setLastUpdated(snapshot.createdAt);
      } catch (e: any) {
         toast("Ops, algo deu errado!", {
            description: e.message,
            closeButton: true,
         });
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      if (user) {
         loadCount();
         // manter estado de check-in existente
         setCheckedIn(localStorage.getItem("gymCheckedIn") === "true");
      }
   }, [user]);

   // Handle check-in
   async function handleCheckIn() {
      if (!user) return;
      setProcessing(true);
      try {
         await gymCheckInService.doCheckIn({ userId: user.id });
         localStorage.setItem("gymCheckedIn", "true");
         setCheckedIn(true);
         await loadCount();
      } catch (e) {
         console.error(e);
      } finally {
         setProcessing(false);
      }
   }

   // Handle check-out
   async function handleCheckOut() {
      if (!user) return;
      setProcessing(true);
      try {
         await gymCheckInService.doCheckOut({ userId: user.id });
         localStorage.setItem("gymCheckedIn", "false");
         setCheckedIn(false);
         await loadCount();
      } catch (e) {
         console.error(e);
      } finally {
         setProcessing(false);
      }
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Presenças</CardTitle>
            <CardDescription>
               {loading ? (
                  <Skeleton className="h-4 w-32" />
               ) : lastUpdated ? (
                  `Atualizado em ${new Date(lastUpdated).toLocaleString(
                     "pt-BR"
                  )}`
               ) : (
                  "Nunca atualizado"
               )}
            </CardDescription>
         </CardHeader>

         <CardContent className="space-y-4 text-center">
            {/* Destaque da contagem */}
            <div className="flex flex-col gap-1">
               Agora na academia
               <div className="text-4xl font-bold">
                  {loading ? <Skeleton className="h-12 w-24 mx-auto" /> : count}
               </div>
            </div>
            <Separator />
            {/* Botão de check-in/checkout */}
            <Button
               onClick={checkedIn ? handleCheckOut : handleCheckIn}
               disabled={processing}
               className="w-full"
            >
               {processing ? (
                  <Skeleton className="h-6 w-full" />
               ) : checkedIn ? (
                  "Check-Out"
               ) : (
                  "Check-In"
               )}
            </Button>
         </CardContent>
      </Card>
   );
}
