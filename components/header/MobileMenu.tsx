"use client";

import { useState } from "react";
import MenuToggle from "./MenuToggle";

export default function MobileMenu() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <div>
         <MenuToggle open={isOpen} onClick={() => setIsOpen(!isOpen)} />

         {isOpen && (
            <div className="absolute top-16 left-0 w-full bg-white dark:bg-dark">
               <ul className="flex flex-col px-4 py-2 text-foreground [&>:not(:last-child)]:border-b *:border-foreground/20 *:py-2">
                  <li>
                     <a href="/" className="mobile-link-menu">
                        Início
                     </a>
                  </li>
                  <li>
                     <a href="/planos" className="mobile-link-menu">
                        Planos
                     </a>
                  </li>
                  <li>
                     <a href="/aulas" className="mobile-link-menu">
                        Aulas
                     </a>
                  </li>
                  <li>
                     <a href="/treinos" className="mobile-link-menu">
                        Treinos
                     </a>
                  </li>
                  <li>
                     <a href="/login" className="mobile-link-menu">
                        Log In
                     </a>
                  </li>
               </ul>
            </div>
         )}
      </div>
   );
}
