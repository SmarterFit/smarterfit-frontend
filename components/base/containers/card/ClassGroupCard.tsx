import { cn } from "@/lib/utils";
import { ClassGroupResponseDTO } from "@/lib/services/classgroup/classGroupService";
import { Users } from "lucide-react"; // ícones sugeridos

type ClassGroupCardProps = {
   classGroup: ClassGroupResponseDTO;
   icon: React.ReactNode;
   className?: string;
};

const baseStyles = "card h-64";

export default function ClassGroupCard({
   classGroup,
   icon,
   className,
}: ClassGroupCardProps) {
   const classes = cn(baseStyles, className);

   return (
      <div className={classes}>
         <div className="flex-1">
            <div className="flex items-center justify-around mb-4 w-full">
               <div className="text-accent text-4xl">{icon}</div>
               <p className="text-lg font-bold text-accent">
                  {classGroup.modalityDTO.name}
               </p>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">
               {classGroup.title}
            </h2>
            <p className="mb-4 text-center">{classGroup.description}</p>
         </div>

         <div className="space-y-2 w-full flex-1">
            <div className="flex gap-2 justify-between rounded bg-background/20 px-8 py-2">
               <div className="flex gap-2 items-center">
                  <Users className="text-accent" width={20} height={20} />
                  <span>Capacidade:</span>
               </div>
               <span>{classGroup.capacity} pessoas</span>
            </div>
         </div>
      </div>
   );
}
