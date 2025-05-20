"use client";

import React from "react";
import { useSidebarContext } from "./SidebarContext";
import SidebarToggle from "./SidebarToggle";
import { cn } from "@/lib/utils";

type SidebarProps = {
   children: React.ReactNode;
   logo?: React.ReactNode;
   title?: string;
   className?: string;
   specialButton?: React.ReactNode; // Exemplo: botão de Logout
};

export default function Sidebar({
   children,
   logo,
   title,
   className,
   specialButton,
}: SidebarProps) {
   const { sidebarOpen } = useSidebarContext();

   return (
      <div
         className={cn("sidebar-container", className, sidebarOpen && "open")}
      >
         <div className="sidebar-header">
            {logo && <div className="sidebar-logo">{logo}</div>}
            {sidebarOpen && title && <h1 className="sidebar-title">{title}</h1>}
            {}
         </div>
         <div className="sidebar-options">{children}</div>
         <div className="sidebar-footer">
            {specialButton}
         </div>
      </div>
   );
}
