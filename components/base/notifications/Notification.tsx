"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

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
   const [visible, setVisible] = useState(false);

   const soundSrc = "/sounds/notification.mp3";

   useEffect(() => {
      const audio = new Audio(soundSrc);
      audio.play().catch((err) => console.error("Erro ao tocar som:", err));

      setVisible(true);

      const timer = setTimeout(() => {
         handleClose();
      }, 5000);

      return () => clearTimeout(timer);
   }, []);

   const handleClose = () => {
      setVisible(false);

      setTimeout(() => {
         onClose();
      }, 500);
   };

   // As classes vão controlar a opacidade
   const classes = cn(baseStyles, type, visible ? "opacity-100" : "opacity-0");

   return (
      <div className={classes} {...props}>
         <div>
            <h3 className="font-semibold">{title}</h3>
            <p>{message}</p>
         </div>
         <button
            onClick={handleClose}
            className="text-lg font-bold bg-transparent text-white hover:text-gray-300 h-8 w-8"
         >
            <X />
         </button>
      </div>
   );
}
