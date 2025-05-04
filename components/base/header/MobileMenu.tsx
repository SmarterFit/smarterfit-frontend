"use client";

import { useState } from "react";
import MenuToggle from "./MenuToggle";

export default function MobileMenu() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div>
         <MenuToggle open={isOpen} onClick={() => setIsOpen(!isOpen)} />

         {isOpen && (
            <div className="fixed top-16 left-0 w-full bg-white dark:bg-dark h-screen">
               <ul className="flex flex-col px-4 py-2 text-foreground [&>:not(:last-child)]:border-b *:border-foreground/20 *:py-2">
                  <li>
                     <a href="#section-hero" className="mobile-link-menu">
                        Início
                     </a>
                  </li>
                  <li>
                     <a href="#section-about" className="mobile-link-menu">
                        Sobre
                     </a>
                  </li>
                  <li>
                     <a href="#section-plans" className="mobile-link-menu">
                        Planos
                     </a>
                  </li>
                  <li>
                     <a href="#section-classes" className="mobile-link-menu">
                        Aulas
                     </a>
                  </li>
                  <li>
                     <a
                        href="#section-testimonials"
                        className="mobile-link-menu"
                     >
                        Comentários
                     </a>
                  </li>
               </ul>
            </div>
         )}
      </div>
   );
}
