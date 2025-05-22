"use client";

import React from "react";

/**
 * Componente de loading spinner usando Tailwind CSS
 * com animação automática via animate-spin
 */
export function LoadingSpinnerCSS() {
   return (
      <div className="flex items-center justify-center p-4">
         <div className="h-8 w-8 rounded-full border-4 border-t-transparent border-primary animate-spin" />
      </div>
   );
}
