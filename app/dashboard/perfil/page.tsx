"use client";

import { AddressResponseDTO } from "@/backend/modules/useraccess/types/addressTypes";
import { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";
import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressTab } from "@/components/user/AddressTab";
import { ProfileTab } from "@/components/user/ProfileTab";
import { SecurityTab } from "@/components/user/SecurityTab";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";

export default function Perfil() {
   const rawUserFromHook = useUser();

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

   const handleAddressUpdated = (updatedAddress: AddressResponseDTO) => {
      if (user) {
         const updatedUser: UserResponseDTO = {
            ...user,
            profile: {
               ...user.profile,
               address: updatedAddress,
            },
         };
         setUser(updatedUser);
         localStorage.setItem("user", JSON.stringify(updatedUser));
      }
   };
   return (
      <Tabs defaultValue="perfil" className="flex w-full sm:flex-row gap-4">
         <TabsList className="flex sm:flex-col h-full sm:w-1/6 sm:gap-2 sm:!bg-transparent w-full items-start sm:px-4">
            <TabsTrigger value="perfil" className="w-full">
               Perfil
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="w-full">
               Segurança
            </TabsTrigger>
            <TabsTrigger value="endereco" className="w-full">
               Endereço
            </TabsTrigger>
         </TabsList>
         <TabsContent value="perfil">
            <ProfileTab
               user={user}
               isLoading={isLoading}
               onUserUpdated={handleUserEmailUpdated}
               onProfileUpdated={handleProfileUpdated}
            />
         </TabsContent>
         <TabsContent value="seguranca">
            <SecurityTab user={user} isLoading={isLoading} />
         </TabsContent>
         <TabsContent value="endereco">
            <AddressTab
               user={user}
               isLoading={isLoading}
               onAddressUpdated={handleAddressUpdated}
            />
         </TabsContent>
      </Tabs>
   );
}
