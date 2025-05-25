"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ClassGroupResponseDTO } from "@/backend/modules/classgroup/types/classGroupTypes";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";
import { ClassGroupService } from "@/backend/modules/classgroup/service/classGroupService";
import { ClassGroupDetailsDialog } from "../dialogs/ClassGroupDetailsDialog";
import { ErrorToast } from "../toasts/Toasts";

export function ClassGroupTable() {
   const [classGroups, setClassGroups] = useState<ClassGroupResponseDTO[]>([]);
   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [selectedGroup, setSelectedGroup] = useState<ClassGroupResponseDTO | null>(null);

   const fetchData = async () => {
      try {
         const response: PageResponseDTO<ClassGroupResponseDTO> =
            await ClassGroupService.getPaged({ page, search });
         setClassGroups(response.items);
         setTotalPages(response.totalPages || 1);
      } catch (e) {
         ErrorToast("Erro ao carregar turmas.");
      }
   };

   useEffect(() => {
      fetchData();
   }, [page, search]);

   return (
      <div className="space-y-6">
         {/* Busca */}
         <div className="flex justify-between">
            <Input
               placeholder="Buscar turma..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="max-w-sm"
            />
         </div>

         {/* Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classGroups.length === 0 ? (
               <p className="text-center col-span-full">Nenhuma turma encontrada.</p>
            ) : (
               classGroups.map((group) => (
                  <Card key={group.id} className="flex flex-col justify-between">
                     <CardHeader>
                        <CardTitle>{group.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                           Modalidade: {group.modality?.name || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                           Início: {new Date(group.startDate).toLocaleDateString("pt-BR")}
                        </p>
                     </CardHeader>
                     <CardContent>
                        <Button
                           variant="outline"
                           onClick={() => setSelectedGroup(group)}
                           className="w-full"
                        >
                           Ver Detalhes
                        </Button>
                     </CardContent>
                  </Card>
               ))
            )}
         </div>

         {/* Paginação */}
         {totalPages > 1 && (
            <Pagination>
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                     <PaginationItem key={i}>
                        <PaginationLink isActive={i + 1 === page} onClick={() => setPage(i + 1)}>
                           {i + 1}
                        </PaginationLink>
                     </PaginationItem>
                  ))}
                  <PaginationItem>
                     <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         )}

         {/* Dialog */}
         {selectedGroup && (
            <ClassGroupDetailsDialog
               group={selectedGroup}
               onClose={() => setSelectedGroup(null)}
               onUpdated={fetchData}
            />
         )}
      </div>
   );
}
