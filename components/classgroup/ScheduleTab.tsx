// components/classgroup/ScheduleTab.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { ClassGroupScheduleResponseDTO } from "@/backend/modules/classgroup/types/classGroupScheduleTypes";
import { ClassGroupScheduleService } from "@/backend/modules/classgroup/service/classGroupScheduleService";
import { EditScheduleDialog } from "@/components/dialogs/classgroup/EditScheduleDialog";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ErrorToast, SuccessToast } from "../toasts/Toasts";
import { useAuthorization } from "@/hooks/useAuthorization";
import { DayOfWeekLabels } from "@/backend/common/enums/dayOfWeekEnum";

interface ScheduleTabProps {
   classGroupId: string;
}

export function ScheduleTab({ classGroupId }: ScheduleTabProps) {
   const [schedules, setSchedules] = useState<ClassGroupScheduleResponseDTO[]>(
      []
   );
   const [loading, setLoading] = useState(true);
   const { isMember } = useAuthorization();

   useEffect(() => {
      loadSchedules();
   }, [classGroupId]);

   const loadSchedules = async () => {
      try {
         setLoading(true);
         // Você precisará implementar este método no service
         const response = await ClassGroupScheduleService.getByClassGroupId(
            classGroupId
         );
         setSchedules(response);
      } catch (error) {
         ErrorToast("Erro ao carregar horários");
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id: string) => {
      try {
         await ClassGroupScheduleService.delete(id);
         SuccessToast("Horário removido com sucesso", "");
         loadSchedules();
      } catch (error) {
         ErrorToast("Erro ao remover horário");
      }
   };

   if (loading) {
      return <div className="flex justify-center py-8">Carregando...</div>;
   }

   return (
      <div className="space-y-4">
         <div className="flex justify-end">
            <EditScheduleDialog
               classGroupId={classGroupId}
               onSuccess={loadSchedules}
            >
               {!isMember() && <Button>Adicionar Horário</Button>}
            </EditScheduleDialog>
         </div>

         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Dia da Semana</TableHead>
                     <TableHead>Horário de Início</TableHead>
                     <TableHead>Horário de Término</TableHead>
                     {!isMember() && <TableHead>Ações</TableHead>}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {schedules.length === 0 ? (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                           Nenhum horário cadastrado
                        </TableCell>
                     </TableRow>
                  ) : (
                     schedules.map((schedule) => (
                        <TableRow key={schedule.id}>
                           <TableCell>
                              {DayOfWeekLabels[schedule.dayOfWeek]}
                           </TableCell>
                           <TableCell>{schedule.startTime}</TableCell>
                           <TableCell>{schedule.endTime}</TableCell>
                           <TableCell>
                              <div className="flex space-x-2">
                                 <EditScheduleDialog
                                    classGroupId={classGroupId}
                                    schedule={schedule}
                                    onSuccess={loadSchedules}
                                 >
                                    {!isMember() && (
                                       <Button variant="outline" size="sm">
                                          Editar
                                       </Button>
                                    )}
                                 </EditScheduleDialog>
                                 {!isMember() && (
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => handleDelete(schedule.id)}
                                    >
                                       <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                 )}
                              </div>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
