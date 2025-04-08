import { cn } from "@/lib/utils";

type InputProps = {
   className?: string;
} & React.ComponentProps<"input">;

const baseStyles = "input";

export default function Input({ className, ...props }: InputProps) {
   const classes = cn(baseStyles, className);
   return (
      <label className={classes}>
         <input {...props} />
      </label>
   );
}
