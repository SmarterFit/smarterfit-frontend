import { cn } from "@/lib/utils";

type SectionProps = {
   children: React.ReactNode;
   className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const baseStyles = "section";

export default function Section({
   children,
   className,
   ...props
}: SectionProps) {
   const classes = cn(baseStyles, className);

   return (
      <section className={classes} {...props}>
         {children}
      </section>
   );
}
