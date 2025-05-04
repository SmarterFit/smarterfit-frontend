import { cn } from "@/lib/utils";
import { ClassGroupResponseDTO } from "@/lib/services/classgroup/classGroupService";

type ClassGroupCardProps = {
   classGroup: ClassGroupResponseDTO;
   icon: React.ReactNode;
   className?: string;
};

const baseStyles = "card";

export default function ClassGroupCard({
   classGroup,
   icon,
   className,
}: ClassGroupCardProps) {
   const classes = cn(baseStyles, className);

   return (
      <div className={classes}>
         <div className="text-accent">{icon}</div>
         <h2 className="text-2xl font-bold">{classGroup.title}</h2>
         <p className="text-xl">{classGroup.description}</p>
         <p className="text-lg font-bold text-accent mt-4">
            {classGroup.modalityDTO.name}
         </p>
      </div>
   );
}
