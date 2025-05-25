"use client";
import { ComponentType, useEffect, useState, useCallback } from "react";
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
import { PageResponseDTO } from "@/backend/common/types/pageTypes";
import { ErrorToast } from "../toasts/Toasts";
import { SearchPlanRequestDTO } from "@/backend/modules/billing/schemas/planSchemas";
import { planService } from "@/backend/modules/billing/services/planServices";
import { CreatedPlanResponseDTO } from "@/backend/modules/billing/types/planTypes";

interface PlanTableProps {
   includeDeleted?: boolean;
   ActionsComponent?: React.ComponentType<{
      plan: CreatedPlanResponseDTO;
   }>;
}

export function PlanTable({
   includeDeleted,
   ActionsComponent,
}: PlanTableProps) {
   const [data, setData] =
      useState<PageResponseDTO<CreatedPlanResponseDTO> | null>(null);
   const [filters, setFilters] = useState<SearchPlanRequestDTO>({
      includeDeleted: includeDeleted || false,
   });
   const [page, setPage] = useState(0);
   const [size, setSize] = useState(10);

   const fetchData = useCallback(async () => {
      try {
         const response = await planService.search(filters, page, size);
         setData(response);
      } catch (e: any) {
         ErrorToast(e.message);
      }
   }, [filters, page, size]);

   // Fetch quando filtros, page ou size mudam
   useEffect(() => {
      fetchData();
   }, [fetchData]);

   const totalPages = data?.totalPages ?? 1;
   const totalElements = data?.totalElements ?? 0;

   return (
      <div className="space-y-4 w-full">
         <div className="flex gap-2 flex-wrap">
            <Input
               placeholder="Nome"
               value={filters.nameTerm || ""}
               onChange={(e) =>
                  setFilters({ ...filters, nameTerm: e.target.value })
               }
               className="flex-1"
            />
            <Input
               placeholder="Preço mínimo"
               type="number"
               value={filters.minPrice ?? ""}
               className="flex-1"
               onChange={(e) =>
                  setFilters({
                     ...filters,
                     minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                  })
               }
            />
            <Input
               placeholder="Preço máximo"
               type="number"
               value={filters.maxPrice ?? ""}
               className="flex-1"
               onChange={(e) =>
                  setFilters({
                     ...filters,
                     maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                  })
               }
            />
            <Input
               placeholder="Duração mínima"
               type="number"
               value={filters.minDuration ?? ""}
               className="flex-1"
               onChange={(e) =>
                  setFilters({
                     ...filters,
                     minDuration: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                  })
               }
            />
            <Input
               placeholder="Duração máxima"
               type="number"
               value={filters.maxDuration ?? ""}
               className="flex-1"
               onChange={(e) =>
                  setFilters({
                     ...filters,
                     maxDuration: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                  })
               }
            />
            <Button onClick={() => fetchData()}>Buscar</Button>
         </div>

         <div className="text-sm text-gray-600">
            Total de elementos: {totalElements} | Total de páginas: {totalPages}
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Máx. Usuários</TableHead>
                  <TableHead>Máx. Aulas</TableHead>
                  {includeDeleted && <TableHead>Status</TableHead>}
                  {ActionsComponent && <TableHead>Ações</TableHead>}
               </TableRow>
            </TableHeader>
            <TableBody>
               {data?.content.map((plan) => (
                  <TableRow key={plan.id}>
                     <TableCell>{plan.name}</TableCell>
                     <TableCell>{plan.price.toFixed(2)}</TableCell>
                     <TableCell>{plan.duration}</TableCell>
                     <TableCell>{plan.maxUsers}</TableCell>
                     <TableCell>{plan.maxClasses}</TableCell>
                     {includeDeleted && (
                        <TableCell>
                           {plan.deletedAt ? "Inativo" : "Ativo"}
                        </TableCell>
                     )}
                     {ActionsComponent && (
                        <TableCell>
                           <ActionsComponent plan={plan} />
                        </TableCell>
                     )}
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
                           data && prev < totalPages - 1 ? prev + 1 : prev
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
