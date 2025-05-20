"use client";

import React from "react";
import { useSidebarContext } from "./SidebarContext";
import { cn } from "@/lib/utils";

type SidebarOptionProps = {
   index: number;
   title: string;
   icon: React.ReactNode;
   onClick?: () => void;
   className?: string;
};

export default function SidebarOption({
   index,
   title,
   icon,
   onClick,
   className,
}: SidebarOptionProps) {
   const { activeIndex, setActiveIndex, sidebarOpen } = useSidebarContext();

   const handleClick = () => {
      // Atualiza o índice ativo, ignorando botões especiais (como toggle, com index -1)
      if (index !== -1) {
         setActiveIndex(index);
      }
      onClick?.();
   };

   return (
      <button
         className={cn(
            "sidebar-option",
            className,
            activeIndex === index && "active"
         )}
         onClick={handleClick}
      >
         <span className="icon">{icon}</span>
         {sidebarOpen && <span className="title">{title}</span>}
      </button>
   );
}
