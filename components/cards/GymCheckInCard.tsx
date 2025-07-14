"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { gymCheckInService } from "@/backend/modules/checkin/services/gymCheckInServices";
import { Separator } from "@/components/ui/separator";
import { ErrorToast } from "@/components/toasts/Toasts";
import {
   format,
   startOfWeek,
   endOfWeek,
   isSameDay,
   isAfter,
   getDay,
   isWithinInterval,
   setHours,
   setMinutes,
   setSeconds,
   setMilliseconds,
} from "date-fns";
import clsx from "clsx";

interface GymCheckInCardProps {
   userId: string;
   hasSubscriptionActive: boolean; // Nova prop
}

export default function GymCheckInCard({
   userId,
   hasSubscriptionActive,
}: GymCheckInCardProps) {
   const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});
   const [loading, setLoading] = useState(true);
   const [processing, setProcessing] = useState(false);

   const [checkedIn, setCheckedIn] = useState<boolean | null>(null);
   const [isGymOpen, setIsGymOpen] = useState(true); // Inicia como true para evitar UI piscando

   const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
   const today = new Date();

   const checkGymOpenStatus = useCallback(() => {
      const now = new Date();
      const dayOfWeek = getDay(now); // Domingo = 0, Sábado = 6
      const openingTime = setMilliseconds(
         setSeconds(setMinutes(setHours(now, 6), 0), 0),
         0
      );
      const closingTime = setMilliseconds(
         setSeconds(setMinutes(setHours(now, 21), 59), 59),
         0
      );

      // Academia abre de Segunda a Sábado (dayOfWeek de 1 a 6)
      const open =
         dayOfWeek !== 0 &&
         isWithinInterval(now, { start: openingTime, end: closingTime });
      setIsGymOpen(open);
      return open;
   }, []);

   function getWeekRange(date: Date) {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const end = endOfWeek(date, { weekStartsOn: 1 });
      return { start, end };
   }

   async function loadPresenceWeek() {
      if (!userId) return;
      setLoading(true);
      const { start, end } = getWeekRange(today);
      const saved = localStorage.getItem(`gymPresence`);

      if (saved) {
         const parsed = JSON.parse(saved);
         if (parsed.weekStart === format(start, "yyyy-MM-dd")) {
            setPresenceMap(parsed.presenceMap);
            setLoading(false);
            return;
         }
      }

      try {
         const checkIns = await gymCheckInService.filterByUserIdAndDate({
            userId: userId,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
         });
         const newPresenceMap: Record<string, boolean> = {};
         for (let i = 0; i < 6; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const hasCheckIn = checkIns.some((checkIn) =>
               isSameDay(new Date(checkIn.checkInTime), day)
            );
            newPresenceMap[format(day, "yyyy-MM-dd")] = hasCheckIn;
         }
         localStorage.setItem(
            `gymPresence`,
            JSON.stringify({
               weekStart: format(start, "yyyy-MM-dd"),
               presenceMap: newPresenceMap,
            })
         );
         setPresenceMap(newPresenceMap);
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setLoading(false);
      }
   }

   async function loadCheckInStatus() {
      if (!userId) return;
      const local = localStorage.getItem(`gymCheckedIn`); // Chave por usuário
      if (local !== null) {
         setCheckedIn(local === "true");
      } else {
         try {
            const hasOpenCheckIn =
               await gymCheckInService.hasOpenCheckInByUserId(userId);
            setCheckedIn(hasOpenCheckIn);
            localStorage.setItem(`gymCheckedIn`, String(hasOpenCheckIn));
         } catch (e: any) {
            ErrorToast(e.message);
         }
      }
   }

   async function handleCheckIn() {
      if (!isGymOpen) {
         ErrorToast("Não é possível fazer check-in, o centro está fechado.");
         return;
      }
      if (!userId || !hasSubscriptionActive) {
         if (!hasSubscriptionActive) {
            ErrorToast(
               "Você não possui uma assinatura ativa para fazer check-in."
            );
         }
         return;
      }
      setProcessing(true);
      try {
         await gymCheckInService.doCheckIn({ userId: userId });
         localStorage.setItem(`gymCheckedIn`, "true");
         setCheckedIn(true);
         await loadPresenceWeek();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setProcessing(false);
      }
   }

   async function handleCheckOut() {
      if (!userId) return;
      setProcessing(true);
      try {
         await gymCheckInService.doCheckOut({ userId: userId });
         localStorage.setItem(`gymCheckedIn`, "false");
         setCheckedIn(false);
         await loadPresenceWeek();
      } catch (e: any) {
         ErrorToast(e.message);
      } finally {
         setProcessing(false);
      }
   }

   useEffect(() => {
      if (userId) {
         loadPresenceWeek();
         loadCheckInStatus();
      }
      // Verifica o status da academia ao montar e a cada minuto
      checkGymOpenStatus();
      const gymStatusIntervalId = setInterval(checkGymOpenStatus, 60 * 1000);

      return () => {
         clearInterval(gymStatusIntervalId);
      };
   }, [userId, checkGymOpenStatus]);

   const { start } = getWeekRange(today);
   const canCheckInOrOut = hasSubscriptionActive;

   return (
      <Card>
         <CardHeader>
            <CardTitle>Presenças Semanais</CardTitle>
            <CardDescription>
               {loading ? (
                  <Skeleton className="h-4 w-32" />
               ) : (
                  "Status atualizado"
               )}
            </CardDescription>
         </CardHeader>

         <CardContent className="space-y-4 text-center">
            <div className="flex justify-center gap-2">
               {weekDays.map((dayLabel, idx) => {
                  const date = new Date(start);
                  date.setDate(start.getDate() + idx);
                  const dateKey = format(date, "yyyy-MM-dd");
                  const presence = presenceMap[dateKey];
                  const isTodayCurrent = isSameDay(date, today);
                  const isFuture = isAfter(date, today);

                  const bgColor = clsx({
                     "bg-gray-300": isFuture,
                     "bg-white border border-gray-300 text-black":
                        !presence && isTodayCurrent && !isFuture,
                     "bg-green-500 text-white": presence,
                     "bg-gray-800 text-white":
                        !presence && !isFuture && !isTodayCurrent,
                  });

                  return (
                     <div
                        key={dateKey}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-xs ${bgColor}`}
                     >
                        {dayLabel}
                     </div>
                  );
               })}
            </div>

            <Separator />

            {!hasSubscriptionActive ? (
               <p className="text-sm text-red-600">
                  Sua assinatura não está ativa. Regularize para fazer check-in.
               </p>
            ) : !isGymOpen && !checkedIn ? (
               <p className="text-sm text-orange-600">
                  O centro está fechado no momento.
               </p>
            ) : null}

            <Button
               onClick={checkedIn ? handleCheckOut : handleCheckIn}
               disabled={
                  processing ||
                  checkedIn === null ||
                  !userId ||
                  !canCheckInOrOut ||
                  (!checkedIn && !isGymOpen) // Desabilita o check-in se a academia estiver fechada
               }
               className="w-full cursor-pointer"
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
