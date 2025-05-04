import { cn } from "@/lib/utils";
import { PlanResponseDTO } from "@/lib/services/billing/planService";

type PlanCardProps = {
   plan: PlanResponseDTO;
   icon: React.ReactNode;
   className?: string;
};

const baseStyles = "card";

export default function PlanCard({ plan, icon, className }: PlanCardProps) {
   const classes = cn(baseStyles, className);

   return (
      <div className={classes}>
         <div className="text-accent">{icon}</div>
         <h2 className="text-2xl font-bold">{plan.name}</h2>
         <p className="text-xl">{plan.description}</p>
         <p className="text-lg font-bold text-accent mt-4">
            R$ {plan.price.toFixed(2)}
         </p>
         <p className="text-sm">Duração: {plan.duration} dias</p>
         <p className="text-sm">Máx. Usuários: {plan.maxUsers}</p>
         <p className="text-sm">Máx. Aulas: {plan.maxClasses}</p>
      </div>
   );
}
