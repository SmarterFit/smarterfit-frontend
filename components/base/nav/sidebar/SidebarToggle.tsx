"use client";

import React from "react";
import SidebarOption from "./SidebarOption";
import { useSidebarContext } from "./SidebarContext";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

type SidebarToggleProps = {
   onClick?: () => void;
};

export default function SidebarToggle({ onClick }: SidebarToggleProps) {
   const { sidebarOpen, setSidebarOpen } = useSidebarContext();

   const handleToggle = () => {
      setSidebarOpen(!sidebarOpen);
      onClick?.();
   };

   return (
      <SidebarOption
         index={-1} 
         title={sidebarOpen ? "Minimizar" : "Expandir"}
         icon={
            sidebarOpen ? (
               <ArrowLeftCircle className="text-white" />
            ) : (
               <ArrowRightCircle className="text-white" />
            )
         }
         onClick={handleToggle}
         className="sidebar-toggle"
      />
   );
}
