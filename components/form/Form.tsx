import { cn } from "@/lib/utils";

type FormProps = {
   className?: string;
} & React.ComponentProps<"form">;

const baseStyles = "form";

export default function Form({ className, ...props }: FormProps) {
   const classes = cn(baseStyles, className);
   return <form className={classes} {...props} />;
}
