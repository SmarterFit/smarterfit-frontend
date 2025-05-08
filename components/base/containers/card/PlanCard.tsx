import { cn } from "@/lib/utils";
import { PlanResponseDTO } from "@/lib/services/billing/planService";
import { CalendarDays, Users, Layers } from "lucide-react"; // Biblioteca de ícones

type PlanCardProps = {
   plan: PlanResponseDTO;
   icon: React.ReactNode;
   className?: string;
};

const baseStyles = "card h-96";

export default function PlanCard({ plan, icon, className }: PlanCardProps) {
   const classes = cn(baseStyles, className);

   return (
      <div className={classes}>
         <div className="flex-1">
            <div className="flex items-center justify-around mb-4 w-full">
               <div className="text-accent text-4xl">{icon}</div>
               <p className="text-lg font-bold text-accent">
                  R$ {plan.price.toFixed(2)}
               </p>
            </div>

            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="mb-4">{plan.description}</p>
         </div>

         <div className="space-y-2 w-full flex-1">
            <div className="flex gap-2 justify-between rounded bg-background/20 px-8 py-2">
               <div className="flex gap-2 items-center">
                  <CalendarDays
                     className="text-accent"
                     width={20}
                     height={20}
                  />
                  <span>Período:</span>
               </div>
               <span>{plan.duration} dias</span>
            </div>
            <div className="flex gap-2 justify-between rounded bg-background/20 px-8 py-2">
               <div className="flex gap-2 items-center">
                  <Users className="text-accent" width={20} height={20} />
                  <span>Participantes:</span>
               </div>
               <span>{plan.maxUsers} pessoas</span>
            </div>
            <div className="flex gap-2 justify-between rounded bg-background/20 px-8 py-2">
               <div className="flex gap-2 items-center">
                  <Layers className="text-accent" width={20} height={20} />
                  <span>Turmas:</span>
               </div>
               <span>{plan.maxClasses} turmas</span>
            </div>
         </div>
      </div>
   );
}
