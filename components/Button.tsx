"use client";

import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type ButtonProps = {
   variant?: "primary" | "secondary" | "tertiary";
   className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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
   const classes = twMerge(
      clsx(baseStyles, variantsStyles[variant], className)
   );
   return (
      <button className={classes} {...props}>
         {children}
      </button>
   );
}
