"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { TrainingGroupResponseDTO } from "@/backend/modules/training-group/types/trainingGroupTypes";
import { SearchTrainingGroupRequestDTO } from "@/backend/modules/training-group/schemas/trainingGroupSchemas";
import {
   TrainingGroupType,
   TrainingGroupTypeLabels,
} from "@/backend/common/enums/trainingGroupEnum";
import { trainingGroupService } from "@/backend/modules/training-group/services/trainingGroupServices";
import { trainingGroupUserService } from "@/backend/modules/training-group/services/trainingGroupUserServices";

// shadcn AlertDialog components
import {
   AlertDialog,
   AlertDialogTrigger,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogCancel,
   AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { PageResponseDTO } from "@/backend/common/types/pageTypes";

interface TrainingGroupTableProps {
   userId: string;
}

export function TrainingGroupTable({ userId }: TrainingGroupTableProps) {
   const [data, setData] =
      useState<PageResponseDTO<TrainingGroupResponseDTO> | null>(null);

   const [filters, setFilters] = useState<SearchTrainingGroupRequestDTO>({
      types: [TrainingGroupType.PUBLIC],
      includeEnded: false,
      includeNotStarted: true,
   });

   const [page, setPage] = useState(0);
   const [size, setSize] = useState(10);

   // Função extraída para handle join
   const handleJoin = useCallback(
      async (groupId: string) => {
         try {
            await trainingGroupUserService.addUserToTrainingGroup(
               groupId,
               userId
            );
            SuccessToast(
               "Entrou no grupo com sucesso!",
               "Você agora faz parte do grupo!"
            );
            fetchData();
         } catch (e: any) {
            ErrorToast(e.message || "Erro ao entrar no grupo");
         }
      },
      [userId]
   );

   const fetchData = useCallback(async () => {
      try {
         const response = await trainingGroupService.search(
            filters,
            page,
            size
         );
         setData(response);
      } catch (e: any) {
         ErrorToast(e.message || "Erro ao buscar grupos de treinamento");
      }
   }, [filters, page, size]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   const totalPages = data?.totalPages ?? 1;
   const totalElements = data?.totalElements ?? 0;

   // filtra localmente por PUBLIC e não finalizados (endDate > hoje)
   const displayGroups =
      data?.content.filter((group) => {
         const isPublic = group.type === TrainingGroupType.PUBLIC;
         const notFinished = new Date(group.endDate) > new Date();
         return isPublic && notFinished;
      }) ?? [];

   return (
      <div className="space-y-4 w-full">
         <div className="flex gap-2 flex-wrap">
            <Input
               placeholder="Nome do grupo"
               value={filters.nameTerm || ""}
               onChange={(e) =>
                  setFilters({ ...filters, nameTerm: e.target.value })
               }
               className="flex-1"
            />
            <Button onClick={() => setPage(0)}>Buscar</Button>
         </div>

         <div className="text-sm text-gray-600">
            Total de grupos: {totalElements} | Total de páginas: {totalPages}
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Fim</TableHead>
                  <TableHead>Ações</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {displayGroups.map((group) => (
                  <TableRow key={group.id}>
                     <TableCell>{group.name}</TableCell>
                     <TableCell>
                        {TrainingGroupTypeLabels[group.type]}
                     </TableCell>
                     <TableCell>
                        {new Date(group.startDate).toLocaleDateString()}
                     </TableCell>
                     <TableCell>
                        {new Date(group.endDate).toLocaleDateString()}
                     </TableCell>
                     <TableCell>
                        <AlertDialog>
                           <AlertDialogTrigger asChild>
                              <Button variant="secondary" size="sm">
                                 Entrar
                              </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                              <AlertDialogHeader>
                                 <AlertDialogTitle>
                                    Confirmar entrada
                                 </AlertDialogTitle>
                                 <AlertDialogDescription>
                                    Deseja realmente entrar no grupo "
                                    {group.name}"?
                                 </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction
                                    onClick={() => handleJoin(group.id)}
                                 >
                                    Confirmar
                                 </AlertDialogAction>
                              </AlertDialogFooter>
                           </AlertDialogContent>
                        </AlertDialog>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>

         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious
                     onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                     className={
                        page === 0 ? "pointer-events-none opacity-50" : ""
                     }
                  />
               </PaginationItem>

               {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                     <PaginationLink
                        onClick={() => setPage(index)}
                        isActive={page === index}
                     >
                        {index + 1}
                     </PaginationLink>
                  </PaginationItem>
               ))}

               <PaginationItem>
                  <PaginationNext
                     onClick={() =>
                        setPage((prev) =>
                           prev < totalPages - 1 ? prev + 1 : prev
                        )
                     }
                     className={
                        page >= totalPages - 1
                           ? "pointer-events-none opacity-50"
                           : ""
                     }
                  />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      </div>
   );
}
