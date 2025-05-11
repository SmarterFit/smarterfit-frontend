import { cn } from "@/lib/utils";
import Button from "./buttons/Button";

type AlertProps = {
   type: "confirmed" | "warning" | "error";
   title: string;
   message: string;
   setVisible: (visible: boolean) => void;
   setSelected?: (option: boolean) => void;
   className?: string;
};

const baseStyles = "alert";

export default function Alert({
   type,
   title,
   message,
   setVisible,
   setSelected,
   className,
}: AlertProps) {
   const classes = cn(baseStyles, className);

   const handleConfirm = () => {
      setSelected?.(true);
      setVisible(false);
   };

   const handleCancel = () => {
      setSelected?.(false);
      setVisible(false);
   };

   const handleClose = () => {
      setVisible(false);
   };

   return (
      <div className="alert-container">
         <div className={classes}>
            <h2 className="alert-title">{title}</h2>
            <p className="alert-message">{message}</p>

            {type === "confirmed" && (
               <div className="alert-actions">
                  <Button
                     className="alert-button bg-green-700 hover:bg-green-800"
                     onClick={handleConfirm}
                  >
                     Confirmar
                  </Button>
                  <Button
                     className="alert-button bg-red-700 hover:bg-red-800"
                     onClick={handleCancel}
                  >
                     Cancelar
                  </Button>
               </div>
            )}

            {type === "warning" && (
               <div className="alert-actions">
                  <Button className="alert-button bg-amber-400 hover:bg-amber-500" onClick={handleClose}>
                     Continuar
                  </Button>
               </div>
            )}

            {type === "error" && (
               <div className="alert-actions">
                  <Button className="alert-button bg-red-700 hover:bg-red-800" onClick={handleClose}>
                     Fechar
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
}
