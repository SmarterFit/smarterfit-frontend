import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell } from "lucide-react";
import { ClassGroupTab } from "@/components/classgroup/ClassGroupTab";
import { ModalityTab } from "@/components/classgroup/ModalityTab";
// import { ClassPlanTab } from "@/components/classgroup/ClassPlanTab";
// import { ClassEventTab } from "@/components/classgroup/ClassEventTab";

export default function ClassGroups() {
   return (
      <div className="p-4 w-full lg:max-w-4xl mx-auto">
         {/* Header com ícone, título e descrição */}
         <div className="flex items-center space-x-3 mb-6">
            <Dumbbell className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Turmas de Estudo</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode visualizar, cadastrar e gerenciar todas as turmas de estudos ativas no sistema.
               </p>
            </div>
         </div>

         <Tabs defaultValue="turmas" className="w-full">
         <TabsList className="w-full">
            <TabsTrigger value="turmas">Turmas</TabsTrigger>
            <TabsTrigger value="modalidades">Modalidades</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
         </TabsList>

         <TabsContent value="turmas" className="mt-4">
            <ClassGroupTab />
         </TabsContent>

         <TabsContent value="modalidades" className="mt-4">
            <ModalityTab />
         </TabsContent>


         <TabsContent value="eventos" className="mt-4">
            {/* <ClassEventTab /> */}
         </TabsContent>
         </Tabs>

      </div>
   );
}
