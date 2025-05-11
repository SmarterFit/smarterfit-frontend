"use client";

import React, { useEffect, useRef, useState } from "react";
import { SidebarContext } from "./SidebarContext";
import SidebarToggle from "./SidebarToggle";
import { cn } from "@/lib/utils";
import SidebarOption from "./SidebarOption";

type SidebarProps = {
   children: React.ReactNode;
   className?: string;
};

export default function Sidebar({ children, className }: SidebarProps) {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState<number | null>(0);

   const toggleSidebarOpen = () => {
      setSidebarOpen(!sidebarOpen);
   };

   const triggerFirstSidebarOptionClick = () => {
      React.Children.forEach(children, (child) => {
         if (React.isValidElement(child) && child.type === SidebarOption) {
            const typedChild = child as React.ReactElement<{
               index: number;
               onClick?: () => void;
            }>;

            if (typedChild.props.index === activeIndex) {
               typedChild.props.onClick && typedChild.props.onClick();
            }
         }
      });
   };

   useEffect(() => {
      if (activeIndex === 0) {
         triggerFirstSidebarOptionClick();
      }
   }, [activeIndex, children]);

   return (
      <SidebarContext.Provider
         value={{ sidebarOpen, activeIndex, setActiveIndex }}
      >
         <div className={cn("sidebar", className, sidebarOpen && "open")}>
            <div className="sidebar-content">{children}</div>
            <SidebarToggle onClick={toggleSidebarOpen} />
         </div>
      </SidebarContext.Provider>
   );
}
