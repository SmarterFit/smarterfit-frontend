"use client";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import Image from "next/image";

export default function Header() {
   return (
      <header className="flex items-center justify-between h-16 px-8 bg-white dark:bg-dark shadow-inset-bottom fixed top-0 left-0 right-0 z-50">
         <figure className="flex items-center gap-2">
            <Image src="/imgs/logo.png" width={50} height={50} alt="Logo" />
            <figcaption className="text-bold text-2xl m-0">
               SmarterFit
            </figcaption>
         </figure>

         <nav className="hidden md:flex">
            <DesktopMenu />
         </nav>

         <div className="md:hidden">
            <MobileMenu />
         </div>
      </header>
   );
}
