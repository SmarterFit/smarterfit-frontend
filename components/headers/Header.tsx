"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { RegisterDialog } from "../dialogs/RegisterDialog";
import { LoginDialog } from "../dialogs/LoginDialog";

interface NavItem {
   title: string;
   href: string;
}

const navItems: NavItem[] = [
   {
      title: "Início",
      href: "#inicio",
   },
   {
      title: "Sobre",
      href: "#sobre",
   },
   {
      title: "Planos",
      href: "#planos",
   },
   {
      title: "Contato",
      href: "#contato",
   },
];

export default function Header() {
   const pathname = usePathname();
   const [open, setOpen] = useState(false);
   const [openLogin, setOpenLogin] = useState(false);
   const [openRegister, setOpenRegister] = useState(false);
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      const token = localStorage.getItem("user");
      setIsAuthenticated(token !== null);
   }, []);

   return (
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="flex h-16 items-center justify-around w-full">
            <div className="flex items-center gap-2">
               <Link href="/" className="flex items-center space-x-2">
                  <Image
                     src="/imgs/logo.png"
                     alt="Logo"
                     width={32}
                     height={32}
                     className="rounded-md"
                  />
                  <span style={{ fontFamily: "var(--font-merienda)" }}>
                     LÚMINA
                  </span>{" "}
                  - Centro de Aprendizagem
               </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-6">
               {navItems.map((item) => (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={`text-sm font-medium transition-colors hover:text-primary ${
                        pathname === item.href
                           ? "text-primary"
                           : "text-muted-foreground"
                     }`}
                  >
                     {item.title}
                  </Link>
               ))}
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden md:flex">
               {isAuthenticated ? (
                  <Button
                     className="cursor-pointer"
                     onClick={() => {
                        window.location.href = "/dashboard";
                     }}
                  >
                     Dashboard
                  </Button>
               ) : (
                  <div className="flex gap-2">
                     <LoginDialog
                        open={openLogin}
                        setOpen={setOpenLogin}
                        openRegister={() => {
                           setOpenRegister(true);
                        }}
                     />
                     <RegisterDialog
                        open={openRegister}
                        setOpen={setOpenRegister}
                        openLogin={() => setOpenLogin(true)}
                     />
                  </div>
               )}
            </div>

            {/* Mobile Navigation */}
            <Sheet open={open} onOpenChange={setOpen}>
               <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" aria-label="Menu">
                     <Menu className="h-5 w-5" />
                  </Button>
               </SheetTrigger>
               <SheetContent side="right">
                  <div className="flex flex-col gap-6 pt-6 px-4">
                     <Link
                        href="/"
                        className="flex items-center space-x-2"
                        onClick={() => setOpen(false)}
                     >
                        <Image
                           src="/imgs/logo.png"
                           alt="Logo"
                           width={32}
                           height={32}
                           className="rounded-md"
                        />
                        <span className="font-bold">LÚMINA</span>
                     </Link>
                     <nav className="flex flex-col gap-4">
                        {navItems.map((item) => (
                           <Link
                              key={item.href}
                              href={item.href}
                              className={`text-sm font-medium transition-colors hover:text-primary ${
                                 pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                              }`}
                              onClick={() => setOpen(false)}
                           >
                              {item.title}
                           </Link>
                        ))}
                     </nav>
                     <div className="mt-4">
                        {isAuthenticated ? (
                           <Button
                              variant="outline"
                              className="w-full cursor-pointer"
                              onClick={() => {
                                 window.location.href = "/dashboard";
                              }}
                           >
                              Dashboard
                           </Button>
                        ) : (
                           <div className="flex flex-col gap-2">
                              <LoginDialog
                                 open={openLogin}
                                 setOpen={setOpenLogin}
                                 openRegister={() => {
                                    setOpenRegister(true);
                                 }}
                              />
                              <RegisterDialog
                                 open={openRegister}
                                 setOpen={setOpenRegister}
                                 openLogin={() => setOpenLogin(true)}
                              />
                           </div>
                        )}
                     </div>
                  </div>
               </SheetContent>
            </Sheet>
         </div>
      </header>
   );
}
