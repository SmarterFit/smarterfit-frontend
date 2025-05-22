"use client";

import React from "react";
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
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import Cookies from "js-cookie";

const navItems = [
   {
      title: "Usuários",
      href: "/dashboard/users",
      icon: <Users className="mr-2 h-4 w-4" />,
   },
   {
      title: "Planos",
      href: "/dashboard/plans",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
   },
   {
      title: "Assinaturas",
      href: "/dashboard/subscriptions",
      icon: <Layers className="mr-2 h-4 w-4" />,
   },
   {
      title: "Grupos de Treinamento",
      href: "/dashboard/groups",
      icon: <Group className="mr-2 h-4 w-4" />,
   },
   {
      title: "Turmas",
      href: "/dashboard/classes",
      icon: <Landmark className="mr-2 h-4 w-4" />,
   },
];

export default function DashboardHeader() {
   const router = useRouter();
   const user = useUser();

   const handleLogout = () => {
      // limpa storage e redireciona
      localStorage.clear();
      Cookies.remove("token");
      Cookies.remove("userId");
      router.push("/");
   };

   return (
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur border-b">
         <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
            {/* Left: Avatar + Welcome */}
            <div className="flex items-center space-x-3">
               <Avatar>
                  <AvatarImage
                     src="/imgs/avatar-placeholder.png"
                     alt={user?.profile.fullName || "Usuário"}
                  />
                  <AvatarFallback>
                     {user?.profile.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
               </Avatar>
               <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">
                     Bem-vindo à <strong>SmarterFit</strong>,{" "}
                     {user?.profile.fullName || "Usuário"}!
                  </span>
                  <motion.span
                     className="inline-block"
                     animate={{ rotate: [0, 20, -10, 20, 0] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                  >
                     🖐️
                  </motion.span>
               </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6">
               <Link
                  href="/dashboard/profile"
                  className="flex items-center text-sm font-medium hover:text-primary"
               >
                  <User className="mr-2 h-4 w-4" /> Perfil
               </Link>
               {navItems.map((item) => (
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

            {/* Desktop Logout */}
            <div className="hidden md:block">
               <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center"
               >
                  <LogOut className="mr-2 h-4 w-4" /> Sair
               </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
               <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                     <Menu />
                  </Button>
               </SheetTrigger>
               <SheetContent side="right" className="w-64">
                  <div className="flex flex-col space-y-4 mt-4">
                     <Link
                        href="/dashboard/profile"
                        className="flex items-center text-sm font-medium"
                     >
                        <User className="mr-2 h-4 w-4" /> Perfil
                     </Link>
                     {navItems.map((item) => (
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
                  <div className="mt-auto mb-4">
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
      </header>
   );
}
