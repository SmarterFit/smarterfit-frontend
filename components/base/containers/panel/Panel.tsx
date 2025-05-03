import { cn } from "@/lib/utils";

type PanelProps = {
   children: React.ReactNode;
   flip?: boolean;
   className?: string;
   flipClassName?: string;
};

const baseStyles = "panel";
const flipStyles = "panel-flip";
const sizeStyles = "panel-size";

export default function Panel({
   children,
   flip = false,
   className,
   flipClassName,
}: PanelProps) {
   const panelClasses = cn(baseStyles, flip ? "" : sizeStyles, className);
   const flipClasses = cn(flipStyles, flipClassName);

   return flip ? (
      <div className={flipClasses}>
         <div className={panelClasses}>{children}</div>
      </div>
   ) : (
      <div className={panelClasses}>{children}</div>
   );
}
