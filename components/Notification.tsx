"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

type NotificationProps = {
   type: "success" | "error" | "warning";
   title: string;
   message: string;
   onClose: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

const baseStyles = "notification";

export default function Notification({
   type,
   title,
   message,
   onClose,
   ...props
}: NotificationProps) {
   useEffect(() => {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
   }, [onClose]);

   const classes = cn(baseStyles, type);

   return (
      <div className={classes} {...props}>
         <div>
            <h3 className="font-semibold">{title}</h3>
            <p>{message}</p>
         </div>
         <button onClick={onClose} className="cursor-pointer h-8 w-8">
            <X />
         </button>
      </div>
   );
}
