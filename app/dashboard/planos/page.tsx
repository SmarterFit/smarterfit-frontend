import { PlanDetailsDialog } from "@/components/dialogs/PlanDetailsDialog";
import CreatePlanForm from "@/components/forms/CreatePlanForm";
import { PlanTable } from "@/components/plans/PlanTable";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

export default function Planos() {
   return (
      <div className="w-full lg:max-w-4xl mx-auto flex flex-col gap-4">
         <div className="flex space-x-3 mb-6">
            <Package className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Planos</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode criar, visualizar e gerenciar todos os planos
                  disponíveis no sistema.
               </p>
            </div>
         </div>

         <CreatePlanForm />

         <Separator />

         <PlanTable ActionsComponent={PlanDetailsDialog} />
      </div>
   );
}
