import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type ModalProps = {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
};

const baseStyles = "modal";
const baseStylesContent = "modal-content";
const baseStylesHeader = "modal-header";
const baseStylesBody = "modal-body";

export default function Modal({
   isOpen,
   onClose,
   title,
   children,
}: ModalProps) {
   const contentRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") onClose();
      };
      if (isOpen) window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
   }, [isOpen, onClose]);

   const handleOutsideClick = (e: React.MouseEvent) => {
      if (
         contentRef.current &&
         !contentRef.current.contains(e.target as Node)
      ) {
         onClose();
      }
   };

   if (!isOpen) return null;

   return (
      <div className={baseStyles} onClick={handleOutsideClick}>
         <div ref={contentRef} className={baseStylesContent}>
            <div className={baseStylesHeader}>
               <h2 className="text-lg font-semibold">{title}</h2>
               <button onClick={onClose} className="h-8 w-8 cursor-pointer">
                  <X />
               </button>
            </div>
            <div className={baseStylesBody}>{children}</div>
         </div>
      </div>
   );
}
