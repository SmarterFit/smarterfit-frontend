import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { useState, useEffect } from "react";

export function useUser(): UserResponseDTO | null {
   const [user, setUser] = useState<UserResponseDTO | null>(null);

   useEffect(() => {
      const data = localStorage.getItem("user");
      if (data) {
         try {
            setUser(JSON.parse(data));
         } catch (error) {
            console.error(
               "Falha ao parsear dados do usuário do localStorage:",
               error
            );
            setUser(null);
         }
      }
   }, []);

   return user;
}
