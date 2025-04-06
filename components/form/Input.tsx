import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type InputProps = {
   className?: string;
} & React.ComponentProps<"input">;

const baseStyles = "input";

export default function Input({ className, ...props }: InputProps) {
   const classes = twMerge(clsx(baseStyles, className));
   return (
      <label className={classes}>
         <input {...props} />
      </label>
   );
}
