"use client";

import { createContext, useContext } from "react";

type SidebarContextProps = {
   sidebarOpen: boolean;
   activeIndex: number | null;
   setActiveIndex: (index: number) => void;
};

export const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebarContext() {
   const context = useContext(SidebarContext);
   if (!context) throw new Error("SidebarContext não encontrado");
   return context;
}
