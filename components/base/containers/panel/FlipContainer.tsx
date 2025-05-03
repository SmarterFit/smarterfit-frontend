import { cn } from "@/lib/utils";

type FlipContainerProps = {
   children: React.ReactNode;
   isFlipped: boolean;
};

const baseStyles = "panel-flip-container";

export default function FlipContainer({
   children,
   isFlipped,
}: FlipContainerProps) {
   const classes = cn(baseStyles, isFlipped ? "rotate-y-180" : "");

   return (
      <div className="perspective-normal">
         <div className={classes}>{children}</div>
      </div>
   );
}
