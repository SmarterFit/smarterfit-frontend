"use client";

import { useEffect, useState } from "react";
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
import { SearchProfileRequestDTO } from "@/backend/modules/useraccess/schemas/profileSchemas";
import { ProfileResponseDTO } from "@/backend/modules/useraccess/types/profileTypes";
import { profileService } from "@/backend/modules/useraccess/services/profileServices";
import { ProfileDetailsDialog } from "../dialogs/ProfileDetailsDialog";
import { ErrorToast } from "../toasts/Toasts";
import { GenderLabels } from "@/backend/common/enums/genderEnum";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ProfileTable() {
   const [data, setData] = useState<PageResponseDTO<ProfileResponseDTO> | null>(
      null
   );
   const [filters, setFilters] = useState<SearchProfileRequestDTO>({});
   const [page, setPage] = useState(0);
   const [size, setSize] = useState(10);

   const fetchData = async () => {
      try {
         const response = await profileService.search(filters, page, size);
         setData(response);
      } catch (e: any) {
         ErrorToast(e.message);
      }
   };

   useEffect(() => {
      fetchData();
   }, [filters, page, size]);

   const totalPages = data?.totalPages ?? 1;

   return (
      <div className="space-y-4 w-full">
         <div className="flex gap-2">
            <Input
               placeholder="Nome"
               value={filters.fullNameTerm || ""}
               onChange={(e) =>
                  setFilters({ ...filters, fullNameTerm: e.target.value })
               }
            />
            <Input
               placeholder="Telefone"
               value={filters.phoneTerm || ""}
               onChange={(e) =>
                  setFilters({ ...filters, phoneTerm: e.target.value })
               }
            />
            <Button onClick={() => fetchData()}>Buscar</Button>
         </div>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Gênero</TableHead>
                  <TableHead>Ações</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {data?.content.map((profile) => (
                  <TableRow key={profile.id}>
                     <TableCell>{profile.fullName}</TableCell>
                     <TableCell>{profile.cpf}</TableCell>
                     <TableCell>{profile.phone}</TableCell>
                     <TableCell>{profile.birthDate ? format(profile.birthDate, "dd/MM/yyyy", {
                        locale: ptBR
                     }) : ""}</TableCell>

                     <TableCell>{GenderLabels[profile.gender]}</TableCell>
                     <TableCell>
                        <ProfileDetailsDialog
                           profile={profile}
                           onDeleted={fetchData}
                        />
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
