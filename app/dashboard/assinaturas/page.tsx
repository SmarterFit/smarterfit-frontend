import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanTable } from "@/components/plans/PlanTable";
import { PlanDetailsDialog } from "@/components/dialogs/PlanDetailsDialog";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import { SubscribeToPlanDialog } from "@/components/dialogs/SubscribeToPlanDialog";
import { MySubscriptionsTab } from "@/components/subscriptions/MySubscriptionsTab";

export default function Assinaturas() {
   return (
      <div className="w-full lg:max-w-4xl mx-auto flex flex-col gap-4">
         <div className="flex space-x-3 mb-6">
            <Package className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Assinaturas</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode visualizar suas assinaturas ou assinar novos
                  planos.
               </p>
            </div>
         </div>

         <Tabs defaultValue="minhas" className="w-full">
            <TabsList className="w-full">
               <TabsTrigger value="minhas">Minhas Assinaturas</TabsTrigger>
               <TabsTrigger value="nova">Nova Assinatura</TabsTrigger>
            </TabsList>

            <TabsContent value="minhas" className="mt-4 flex flex-col gap-4">
               <h2 className="text-xl font-semibold">Minhas Assinaturas</h2>
               <p className="text-muted-foreground">
                  Em breve você poderá visualizar e gerenciar suas assinaturas
                  aqui.
               </p>
               <Separator />
               <MySubscriptionsTab />
            </TabsContent>

            <TabsContent value="nova" className="mt-4 flex flex-col gap-4">
               <h2 className="text-xl font-semibold">Nova Assinatura</h2>
               <p className="text-muted-foreground">
                  Selecione um plano abaixo para realizar uma nova assinatura.
               </p>
               <Separator />
               <PlanTable ActionsComponent={SubscribeToPlanDialog} />
            </TabsContent>
         </Tabs>
      </div>
   );
}
