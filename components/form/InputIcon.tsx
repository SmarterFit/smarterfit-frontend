import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

type InputIconProps = {
   icon: React.ReactElement<{ className?: string }>;
   className?: string;
} & React.ComponentProps<"input">;

const baseStyles = "group input";

export default function InputIcon({
   icon,
   className,
   ...props
}: InputIconProps) {
   const classes = twMerge(clsx(baseStyles, className));

   const enhancedIcon = React.isValidElement(icon)
      ? React.cloneElement(icon, {
           className: twMerge(
              "text-foreground/40 group-focus-within:text-foreground",
              icon.props.className
           ),
        })
      : icon;

   return (
      <label className={classes}>
         {enhancedIcon}
         <input {...props} />
      </label>
   );
}
