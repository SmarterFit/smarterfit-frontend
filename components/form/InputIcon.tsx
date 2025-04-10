import { cn } from "@/lib/utils";
import React from "react";

type InputIconProps = {
   icon: React.ReactElement<{ className?: string }>;
   className?: string;
} & React.ComponentProps<"input">;

const baseStyles = "group input";
const iconBaseStyles =
   "shrink-0 text-foreground/40 group-focus-within:text-foreground";

export default function InputIcon({
   icon,
   className,
   ...props
}: InputIconProps) {
   const classes = cn(baseStyles, className);

   const enhancedIcon = React.isValidElement(icon)
      ? React.cloneElement(icon, {
           className: cn(iconBaseStyles, icon.props.className),
        })
      : icon;

   return (
      <label className={classes}>
         {enhancedIcon}
         <input {...props} />
      </label>
   );
}
