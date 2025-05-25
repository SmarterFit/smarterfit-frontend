import { ProfileTable } from "@/components/user/ProfilesTable";
import { User } from "lucide-react";

export default function Users() {
   return (
      <div className="w-full lg:max-w-4xl mx-auto">
         {/* Header com ícone, título e descrição */}
         <div className="flex items-center space-x-3 mb-6">
            <User className="h-8 w-8 text-primary" />
            <div>
               <h1 className="text-3xl font-semibold">Perfis de Usuários</h1>
               <p className="text-sm text-muted-foreground">
                  Aqui você pode buscar, visualizar e gerenciar todos os perfis
                  cadastrados no sistema.
               </p>
            </div>
         </div>

         {/* Container da tabela, com largura limitada em telas grandes */}
         <div className="w-full ">
            <ProfileTable />
         </div>
      </div>
   );
}
