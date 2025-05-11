"use client";

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
   const { sidebarOpen, activeIndex, setActiveIndex } = useSidebarContext();

   const handleClick = () => {
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
         {icon}
         {sidebarOpen && <span>{title}</span>}
      </button>
   );
}
