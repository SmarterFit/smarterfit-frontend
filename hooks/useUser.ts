import { UserResponseDTO } from "@/backend/modules/useraccess/types/userTypes";
import { useState, useEffect } from "react";

export function useUser(): UserResponseDTO | null {
   const [user, setUser] = useState<UserResponseDTO | null>(null);

   useEffect(() => {
      const data = localStorage.getItem("user");
      if (data) {
         setUser(JSON.parse(data));
      }
   }, []);

   return user;
}
