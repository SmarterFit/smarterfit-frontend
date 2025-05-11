"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/base/nav/sidebar/Sidebar";
import SidebarOption from "@/components/base/nav/sidebar/SidebarOption";
import { LayoutDashboard, LogOut, User, Users } from "lucide-react";

export default function DashboardSidebar() {
   const router = useRouter();
   const [isAdmin, setIsAdmin] = useState(false);

   useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
         try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.roles?.includes("ADMIN")) {
               setIsAdmin(true);
            }
         } catch (e) {
            console.error("Erro ao ler user do localStorage:", e);
         }
      }
   }, []);

   return (
      <Sidebar>
         <SidebarOption
            index={0}
            title="Dashboard"
            icon={<LayoutDashboard />}
         />
         <SidebarOption
            index={1}
            title="Meu perfil"
            icon={<User />}
            onClick={() => router.push("/dashboard/perfil")}
         />
         {isAdmin && (
            <SidebarOption
               index={2}
               title="Usuários"
               icon={<Users />}
               onClick={() => router.push("/dashboard/usuarios")}
            />
         )}
         <SidebarOption
            index={10}
            title="Sair"
            icon={<LogOut />}
            onClick={() => {
               localStorage.clear();
               router.push("/");
            }}
         />
      </Sidebar>
   );
}
