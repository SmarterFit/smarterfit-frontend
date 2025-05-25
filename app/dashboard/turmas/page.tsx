import { Dumbbell } from "lucide-react";
import { ClassGroupTable } from "@/components/classgroup/ClassGroupTable";

export default function ClassGroups() {
   return (
      <div className="p-4 w-full lg:max-w-4xl mx-auto">
         {/* Header com ícone, título e descrição */}
         <div className="flex items-center space-x-3 mb-6">
            <Dumbbell className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Turmas de Treinamento</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode visualizar, cadastrar e gerenciar todas as turmas de treino ativas no sistema.
               </p>
            </div>
         </div>

         {/* Container da tabela */}
         <div className="w-full">
            <ClassGroupTable />
         </div>
      </div>
   );
}
