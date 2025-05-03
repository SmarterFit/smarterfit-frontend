"use client";

import { cn } from "@/lib/utils";

type ButtonProps = {
   variant?: "primary" | "secondary" | "tertiary";
   className?: string;
} & React.ComponentProps<"button">;

const baseStyles = "button";

const variantsStyles = {
   primary: "primary",
   secondary: "secondary",
   tertiary: "tertiary",
};

export default function Button({
   variant = "primary",
   className,
   children,
   ...props
}: ButtonProps) {
   const classes = cn(baseStyles, variantsStyles[variant], className);

   return (
      <button className={classes} {...props}>
         {children}
      </button>
   );
}
