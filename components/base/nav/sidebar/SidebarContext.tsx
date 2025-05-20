import React, { createContext, useState, useContext, ReactNode } from "react";

interface SidebarContextProps {
   isCollapsed: boolean;
   setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
   undefined
);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
   children,
}) => {
   const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

   return (
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
         {children}
      </SidebarContext.Provider>
   );
};

export const useSidebar = (): SidebarContextProps => {
   const context = useContext(SidebarContext);
   if (!context) {
      throw new Error("useSidebar must be used within a SidebarProvider");
   }
   return context;
};
