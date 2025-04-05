import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type CardProps = {
   children: React.ReactNode;
   className?: string;
};

export default function Card({ children, className }: CardProps) {
   const classes = twMerge(clsx("card", className));
   return <div className={classes}>{children}</div>;
}
