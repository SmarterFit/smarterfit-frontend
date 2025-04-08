import { cn } from "@/lib/utils";

type InputGroupProps = {
   children: React.ReactNode;
   className?: string;
};

const baseStyles = "input-group";

export default function InputGroup({ children, className }: InputGroupProps) {
   const classes = cn(baseStyles, className);

   return <div className={classes}>{children}</div>;
}
