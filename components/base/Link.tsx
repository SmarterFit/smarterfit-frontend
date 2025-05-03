import { cn } from "@/lib/utils";

type LinkProps = {
   variant?: "primary" | "secondary" | "tertiary";
   className?: string;
} & React.ComponentProps<"a">;

const baseStyles = "link";

const variantsStyles = {
   primary: "button primary",
   secondary: "button secondary",
   tertiary: "button tertiary",
};

export default function Link({
   variant,
   className,
   children,
   ...props
}: LinkProps) {
   const classes = cn(
      baseStyles,
      variant ? variantsStyles[variant] : "",
      className
   );
   return (
      <a className={classes} {...props}>
         {children}
      </a>
   );
}
