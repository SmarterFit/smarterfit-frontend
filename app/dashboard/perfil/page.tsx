"use client";

import React, { useState, useEffect } from "react";
import { UserSettings } from "@/components/user/UserSettings";
import { SecuritySettings } from "@/components/user/SecuritySettings";
import { ProfileSettings } from "@/components/user/ProfileSettings";
import { useUser as useUserFromHook } from "@/hooks/useUser";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";

export default function PerfilPage() {
   const rawUserFromHook = useUserFromHook();

   const [user, setUser] = useState<UserResponseDTO | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (rawUserFromHook !== undefined) {
         setUser(rawUserFromHook);
      }
      setIsLoading(false);
   }, [rawUserFromHook]);

   const handleUserEmailUpdated = (
      updatedUserFromSettings: UserResponseDTO
   ) => {
      setUser(updatedUserFromSettings);
      localStorage.setItem("user", JSON.stringify(updatedUserFromSettings));
   };

   const handleProfileUpdated = (updatedProfile: ProfileResponseDTO) => {
      if (user) {
         const updatedUserWithNewProfile: UserResponseDTO = {
            ...user,
            profile: updatedProfile,
         };
         setUser(updatedUserWithNewProfile);
         localStorage.setItem(
            "user",
            JSON.stringify(updatedUserWithNewProfile)
         );
      }
   };

   if (isLoading) {
      return (
         <div className="container mx-auto py-10 px-4 space-y-8">
            {/* Skeleton para UserSettings */}
            <div className="flex items-center justify-between space-x-4 p-6 border-b">
               <div className="flex items-center space-x-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                     <Skeleton className="h-6 w-[200px]" />
                     <Skeleton className="h-4 w-[180px]" />
                     <Skeleton className="h-4 w-[150px]" />
                  </div>
               </div>
               <Skeleton className="h-10 w-32 rounded-md" />{" "}
               {/* Botão Editar Email */}
            </div>
            <Separator className="my-8" />
            {/* Skeleton para SecuritySettings */}
            <div className="p-6 border rounded-lg shadow-sm">
               <Skeleton className="h-6 w-1/3 mb-2" /> {/* Título */}
               <Skeleton className="h-4 w-full mb-4" /> {/* Descrição */}
               <Skeleton className="h-10 w-32 rounded" />{" "}
               {/* Botão Alterar Senha */}
            </div>
            <Separator className="my-8" />
            <div className="p-6 border rounded-lg shadow-sm">
               <Skeleton className="h-8 w-3/4 mb-4" /> {/* Nome */}
               <div className="space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-1/2" />
               </div>
               <Skeleton className="h-10 w-32 mt-6 rounded" />{" "}
            </div>
         </div>
      );
   }

   if (!user) {
      return (
         <div className="container mx-auto py-10 px-4">
            <div className="mt-10 text-center">
               <p className="text-muted-foreground">
                  Para visualizar o perfil, por favor, faça o login.
               </p>
            </div>
         </div>
      );
   }

   return (
      <>
         <div className="container mx-auto py-10 px-4 space-y-8">
            <UserSettings
               user={user}
               isLoading={false}
               onUserEmailUpdated={handleUserEmailUpdated}
            />

            <Separator className="my-8" />

            <SecuritySettings user={user} />

            <Separator className="my-8" />

            <ProfileSettings
               profile={user.profile}
               isLoading={false}
               onProfileUpdated={handleProfileUpdated}
            />
         </div>
      </>
   );
}
