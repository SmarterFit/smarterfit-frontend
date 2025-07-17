"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
   Menu,
   User,
   LogOut,
   Users,
   ClipboardList,
   Layers,
   Group,
   Landmark,
   Home,
   ListChecks,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import Cookies from "js-cookie";
import { RoleType } from "@/backend/common/enums/rolesEnum";

const navItems: Array<{
   title: string;
   href: string;
   icon: React.ReactNode;
   nonMember?: boolean;
}> = [
   {
      title: "Início",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
   },
   {
      title: "Usuários",
      href: "/dashboard/usuarios",
      icon: <Users className="mr-2 h-4 w-4" />,
      nonMember: true,
   },
   {
      title: "Planos",
      href: "/dashboard/planos",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      nonMember: true,
   },
   {
      title: "Assinaturas",
      href: "/dashboard/assinaturas",
      icon: <Layers className="mr-2 h-4 w-4" />,
   },
   {
      title: "Grupos de Treinamento",
      href: "/dashboard/grupos",
      icon: <Group className="mr-2 h-4 w-4" />,
   },
   {
      title: "Turmas",
      href: "/dashboard/turmas",
      icon: <Landmark className="mr-2 h-4 w-4" />,
   },
   {
      title: "Métricas",
      href: "/dashboard/metricas",
      icon: <ListChecks className="mr-2 h-4 w-4" />,
   },
];

export default function DashboardHeader() {
   const router = useRouter();
   const user = useUser();
   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

   useEffect(() => {
      const stored = localStorage.getItem("userAvatar");
      if (stored) setAvatarUrl(stored);
   }, []);

   const handleLogout = () => {
      localStorage.clear();
      Cookies.remove("token");
      Cookies.remove("userId");
      router.push("/");
   };

   // Verifica se usuário tem apenas role MEMBER
   const isMemberOnly =
      user?.roles && user.roles.every((r) => r === RoleType.MEMBER);

   return (
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur border-b">
         <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
            {/* Left: Avatar + Welcome + Menu */}
            <div className="flex items-center space-x-3">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Avatar className="h-8 w-8 cursor-pointer">
                        {avatarUrl ? (
                           <AvatarImage
                              src={avatarUrl}
                              alt={user?.profile?.fullName || "Usuário"}
                           />
                        ) : (
                           <AvatarFallback>
                              {user?.profile?.fullName?.charAt(0) || "U"}
                           </AvatarFallback>
                        )}
                     </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="mt-1">
                     <DropdownMenuItem asChild>
                        <Link
                           href="/dashboard/perfil"
                           className="flex items-center"
                        >
                           <User className="mr-2 h-4 w-4" /> Perfil
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        onSelect={handleLogout}
                        className="flex items-center"
                     >
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
               <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">
                     Bem-vindo à <strong>HUBpro</strong>,{" "}
                     {user?.profile?.fullName || "Usuário"}!
                  </span>
                  <motion.span
                     animate={{ rotate: [0, 20, -10, 20, 0] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                  >
                     🖐️
                  </motion.span>
               </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6">
               {navItems
                  .filter((item) => !item.nonMember || !isMemberOnly)
                  .map((item) => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center text-sm font-medium hover:text-primary"
                     >
                        {item.icon}
                        {item.title}
                     </Link>
                  ))}
            </nav>

            {/* Mobile Menu & Logout */}
            <div className="flex items-center md:hidden space-x-2">
               <Sheet>
                  <SheetTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                     >
                        <Menu />
                     </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                     <div className="flex flex-col space-y-4 m-4">
                        {navItems
                           .filter((item) => !item.nonMember || !isMemberOnly)
                           .map((item) => (
                              <Link
                                 key={item.href}
                                 href={item.href}
                                 className="flex items-center text-sm font-medium"
                              >
                                 {item.icon}
                                 {item.title}
                              </Link>
                           ))}
                     </div>
                     <div className="mt-auto m-4">
                        <Button
                           variant="outline"
                           className="w-full flex items-center cursor-pointer"
                           onClick={handleLogout}
                        >
                           <LogOut className="mr-2 h-4 w-4" /> Sair
                        </Button>
                     </div>
                  </SheetContent>
               </Sheet>
            </div>

            {/* Desktop Logout hidden (now in avatar menu) */}
         </div>
      </header>
   );
}
