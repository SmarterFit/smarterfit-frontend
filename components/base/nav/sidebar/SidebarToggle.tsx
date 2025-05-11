"use client";

import SidebarOption from "./SidebarOption";
import { ArrowRightCircle, ArrowLeftCircle } from "lucide-react";
import { useSidebarContext } from "./SidebarContext";

type SidebarToggleProps = {
   onClick: () => void;
};

export default function SidebarToggle({ onClick }: SidebarToggleProps) {
   const { sidebarOpen } = useSidebarContext();

   return (
      <SidebarOption
         title={sidebarOpen ? "Minimizar" : "Expandir"}
         icon={
            sidebarOpen ? (
               <ArrowLeftCircle className="text-white" />
            ) : (
               <ArrowRightCircle className="text-white" />
            )
         }
         onClick={onClick}
         index={-1}
      />
   );
}
