import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type InfoCardProps = {
   icon: React.ReactNode;
   title: string;
   description: string;
   className?: string;
};

export default function InfoCard({
   icon,
   title,
   description,
   className,
}: InfoCardProps) {
   const classes = twMerge(clsx("card", className));

   return (
      <div className={classes}>
         <div className="text-accent">{icon}</div>
         <h2 className="text-2xl font-bold">{title}</h2>
         <p className="text-xl">{description}</p>
      </div>
   );
}
