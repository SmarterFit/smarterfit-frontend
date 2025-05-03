import { cn } from "@/lib/utils";

type SectionsContainerProps = {
   children: React.ReactNode;
   className?: string;
};

const baseStyles = "sections-container custom-scroll";

export default function SectionsContainer({
   children,
   className,
}: SectionsContainerProps) {
   const classes = cn(baseStyles, className);

   return <div className={classes}>{children}</div>;
}
