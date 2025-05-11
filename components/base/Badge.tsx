import React, { useEffect, useState } from "react";

export type BadgeProps = {
   value: string;
   color?: number;
};

const baseStyles = "badge";

export default function Badge({ value, color = -1 }: BadgeProps) {
   const [fixedColor, setFixedColor] = useState<string>("");

   useEffect(() => {
      const colorClass = color === -1 ? getColorClass() : getColorClass(color);
      setFixedColor(colorClass);
   }, [color]);

   return <span className={`${baseStyles} ${fixedColor}`}>{value}</span>;
}

function getColorClass(color?: number): string {
   if (!color) {
      color = Math.floor(Math.random() * 32) + 1;
   }

   const safeColor = Math.max(1, Math.min(color, 32));
   return `badge-color-${safeColor}`;
}
