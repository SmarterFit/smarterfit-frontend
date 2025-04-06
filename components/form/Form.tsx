import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type FormProps = {
   className?: string;
} & React.ComponentProps<"form">;

const baseStyles = "form";

export default function Form({ className, ...props }: FormProps) {
   const classes = twMerge(clsx(baseStyles, className));
   return <form className={classes} {...props} />;
}
